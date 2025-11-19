from app.config import Config
import logging
from datetime import datetime
import asyncio

from aptos_sdk.transactions import EntryFunction, TransactionArgument, TransactionPayload
from aptos_sdk.bcs import Serializer


class BlockchainService:
    @staticmethod
    def _ensure_client():
        if not hasattr(Config, 'REST_CLIENT'):
            Config.init_blockchain()
        return Config.REST_CLIENT

    @staticmethod
    def store_evidence_hash(sha256_hash: str, case_id, description: str = ""):
        """Store evidence hash on Aptos. Returns (tx_hash, gas_used_apt)."""
        try:
            client = BlockchainService._ensure_client()

            # Validate hash length (32 bytes hex, without 0x)
            hash_bytes = bytes.fromhex(sha256_hash)
            if len(hash_bytes) != 32:
                raise ValueError("Invalid SHA256 hash length")

            case_bytes = str(case_id).encode('utf-8')

            # Prepare entry function payload: trm::evidence::log_evidence(case_id_bytes, hash_bytes)
            module_addr = Config.APTOS_MODULE_ADDRESS
            func = f"{module_addr}::{Config.APTOS_MODULE_NAME}::log_evidence"
            args = [
                TransactionArgument(case_bytes, Serializer.sequence_serializer(Serializer.u8)),
                TransactionArgument(hash_bytes, Serializer.sequence_serializer(Serializer.u8)),
            ]
            payload = TransactionPayload(EntryFunction.natural(func, [], args))

            async def _submit_and_fetch():
                pending = await client.submit_transaction(Config.APTOS_ACCOUNT, payload)
                await client.wait_for_transaction(pending)
                tx_hash_local = pending.get("hash", pending) if isinstance(pending, dict) else pending
                gas_used_local = 0.0
                try:
                    tx_info = await client.get_transaction_by_hash(tx_hash_local)
                    gas_used_octa = int(tx_info.get("gas_used", 0)) * int(tx_info.get("gas_unit_price", 0))
                    gas_used_val = gas_used_octa / 1e8
                    return tx_hash_local, gas_used_val
                except Exception:
                    return tx_hash_local, 0.0

            tx_hash, gas_used = asyncio.run(_submit_and_fetch())
            return tx_hash, gas_used
        except Exception as e:
            logging.error(f"Error storing evidence on Aptos: {str(e)}")
            raise

    @staticmethod
    def get_blockchain_logs_by_case(case_id):
        """Fetch transaction info for evidences in a case using stored tx hashes."""
        try:
            client = BlockchainService._ensure_client()
            from app.models.evidence import Evidence
            evidences = Evidence.query.filter_by(case_id=case_id).all()

            logs = []
            for evidence in evidences:
                tx_hash = evidence.blockchain_tx_hash
                if not tx_hash:
                    continue
                try:
                    async def _get():
                        return await client.get_transaction_by_hash(tx_hash)
                    tx_info = asyncio.run(_get())
                    success = bool(tx_info.get("success", False))
                    timestamp_ms = int(tx_info.get("timestamp", 0))
                    gas_used_octa = int(tx_info.get("gas_used", 0)) * int(tx_info.get("gas_unit_price", 0))
                    gas_used = gas_used_octa / 1e8

                    logs.append({
                        'id': evidence.id,
                        'txHash': tx_hash,
                        'blockNumber': tx_info.get('version', 'Unknown'),
                        'timestamp': datetime.fromtimestamp(timestamp_ms / 1000).isoformat() if timestamp_ms else evidence.created_at.isoformat(),
                        'gasUsed': gas_used,
                        'status': 'confirmed' if success else 'failed',
                        'confirmations': 1,  # Aptos uses versions; confirmation depth is less relevant
                        'from': tx_info.get('sender', 'Unknown'),
                        'to': f"{Config.APTOS_MODULE_ADDRESS}::{Config.APTOS_MODULE_NAME}",
                        'evidenceHash': evidence.sha256_hash,
                        'filename': evidence.filename,
                        'action': 'Evidence Stored',
                        'description': f'Evidence "{evidence.filename}" hash stored for case {case_id}'
                    })
                except Exception as e:
                    logging.warning(f"Could not fetch Aptos tx {tx_hash}: {e}")
                    logs.append({
                        'id': evidence.id,
                        'txHash': tx_hash,
                        'blockNumber': 'Unknown',
                        'timestamp': evidence.created_at.isoformat() if evidence.created_at else datetime.now().isoformat(),
                        'gasUsed': 0.0,
                        'status': 'unknown',
                        'confirmations': 0,
                        'from': 'Unknown',
                        'to': f"{Config.APTOS_MODULE_ADDRESS}::{Config.APTOS_MODULE_NAME}",
                        'evidenceHash': evidence.sha256_hash,
                        'filename': evidence.filename,
                        'action': 'Evidence Stored',
                        'description': f'Evidence "{evidence.filename}" hash stored for case {case_id} (blockchain data unavailable)'
                    })

            return logs
        except Exception as e:
            logging.error(f"Error getting Aptos logs: {str(e)}")
            return []

    @staticmethod
    def log_evidence_to_blockchain(case_id, sha256_hash):
        try:
            tx_hash, _ = BlockchainService.store_evidence_hash(sha256_hash, case_id)
            return tx_hash
        except Exception as e:
            logging.error(f"Error logging to Aptos: {str(e)}")
            raise
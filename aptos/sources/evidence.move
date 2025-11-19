module trm::evidence {
    use std::vector;
    use std::signer;
    use std::error;

    use 0x1::table;
    use 0x1::timestamp;

    // Store resource for evidence management (events removed to avoid friend restrictions)
    struct Store has key {
        owner: address,
        authorized: table::Table<address, bool>,
        // case_id -> (hash -> exists)
        evidence: table::Table<vector<u8>, table::Table<vector<u8>, bool>>,
        // case_id -> list of hashes (kept for indexing)
        case_hashes: table::Table<vector<u8>, vector<vector<u8>>>,
        // uploader -> list of hashes
        uploader_hashes: table::Table<address, vector<vector<u8>>>,
    }

    // Error codes
    const E_NOT_OWNER: u64 = 1;
    const E_ALREADY_EXISTS: u64 = 2;

    // Helper: clone a vector<u8> (Move doesn't provide a built-in clone for vectors)
    fun clone_bytes(src: &vector<u8>): vector<u8> {
        let res: vector<u8> = vector::empty();
        let len = vector::length(src);
        let i: u64 = 0;
        while (i < len) {
            // borrow returns &u8, deref to get u8
            let b_ref = vector::borrow(src, i);
            let b = *b_ref;
            vector::push_back(&mut res, b);
            i = i + 1;
        };
        res
    }

    // Initialize the Store under the caller account
    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<Store>(addr), error::already_exists(0));

        let authorized: table::Table<address, bool> = table::new();
        table::add(&mut authorized, addr, true);

        move_to(account, Store {
            owner: addr,
            authorized,
            evidence: table::new(),
            case_hashes: table::new(),
            uploader_hashes: table::new(),
        });
    }

    // Owner can authorize or deauthorize an uploader
    public entry fun set_uploader(admin: &signer, uploader: address, is_authorized: bool) acquires Store {
        let addr = signer::address_of(admin);
        let store = borrow_global_mut<Store>(addr);
        assert!(addr == store.owner, error::permission_denied(E_NOT_OWNER));

        if (table::contains(&store.authorized, uploader)) {
            table::remove(&mut store.authorized, uploader);
        };
        if (is_authorized) {
            table::add(&mut store.authorized, uploader, true);
        };
    }

    // Log evidence for a given case_id and evidence_hash
    // NOTE: We accept owned vectors and clone them where we need multiple copies.
    public entry fun log_evidence(uploader: &signer, case_id: vector<u8>, evidence_hash: vector<u8>) acquires Store {
        let admin_addr = get_admin_address();
        let store = borrow_global_mut<Store>(admin_addr);
        let uploader_addr = signer::address_of(uploader);

        // Permission check: owner or authorized uploader
        let is_owner = uploader_addr == store.owner;
        let is_auth = if (table::contains(&store.authorized, uploader_addr)) {
            *table::borrow(&store.authorized, uploader_addr)
        } else { false };
        assert!(is_owner || is_auth, error::permission_denied(E_NOT_OWNER));

        // Ensure nested table for case exists
        let case_exists = table::contains(&store.evidence, case_id);
        if (!case_exists) {
            let inner: table::Table<vector<u8>, bool> = table::new();
            // we must provide an owned key to table::add; clone the case_id
            let key_ci = clone_bytes(&case_id);
            table::add(&mut store.evidence, key_ci, inner);
        };
        let inner_ref = table::borrow_mut(&mut store.evidence, case_id);

        // Duplicate check (need to borrow from inner_ref)
        let exists = if (table::contains(inner_ref, evidence_hash)) {
            *table::borrow(inner_ref, evidence_hash)
        } else { false };
        assert!(!exists, error::invalid_argument(E_ALREADY_EXISTS));

        // Mark present (table::add consumes the key, so clone evidence_hash)
        let evidence_clone_for_table = clone_bytes(&evidence_hash);
        table::add(inner_ref, evidence_clone_for_table, true);

        // Append to case_hashes (create vector if missing)
        let case_hashes_vec = if (table::contains(&store.case_hashes, case_id)) {
            table::borrow_mut(&mut store.case_hashes, case_id)
        } else {
            let empty: vector<vector<u8>> = vector::empty();
            let key_ci2 = clone_bytes(&case_id);
            table::add(&mut store.case_hashes, key_ci2, empty);
            table::borrow_mut(&mut store.case_hashes, case_id)
        };
        // push a clone into the vector<vector<u8>>
        let evidence_clone_for_vec1 = clone_bytes(&evidence_hash);
        vector::push_back(case_hashes_vec, evidence_clone_for_vec1);

        // Append to uploader_hashes (create vector if missing)
        let uploader_vec = if (table::contains(&store.uploader_hashes, uploader_addr)) {
            table::borrow_mut(&mut store.uploader_hashes, uploader_addr)
        } else {
            let empty2: vector<vector<u8>> = vector::empty();
            table::add(&mut store.uploader_hashes, uploader_addr, empty2);
            table::borrow_mut(&mut store.uploader_hashes, uploader_addr)
        };
        let evidence_clone_for_vec2 = clone_bytes(&evidence_hash);
        vector::push_back(uploader_vec, evidence_clone_for_vec2);

        // Note: events are removed in this version. Off-chain clients should read the
        // case_hashes or uploader_hashes tables (via indexer) to get historical data.
    }

    // Check existence of an evidence hash under a case_id
    #[view]
    public fun verify_evidence_hash(case_id: vector<u8>, evidence_hash: vector<u8>): bool acquires Store {
        let admin_addr = get_admin_address();
        if (!exists<Store>(admin_addr)) return false;
        let store = borrow_global<Store>(admin_addr);
        if (!table::contains(&store.evidence, case_id)) return false;
        let inner = table::borrow(&store.evidence, case_id);
        if (!table::contains(inner, evidence_hash)) return false;
        *table::borrow(inner, evidence_hash)
    }

    // Return the number of evidence hashes recorded for a case (safe read-only)
    #[view]
    public fun get_case_evidence_count(case_id: vector<u8>): u64 acquires Store {
        let admin_addr = get_admin_address();
        if (!exists<Store>(admin_addr)) return 0;
        let store = borrow_global<Store>(admin_addr);
        if (!table::contains(&store.case_hashes, case_id)) return 0;

        let hashes_ref = table::borrow(&store.case_hashes, case_id);
        vector::length(hashes_ref)
    }

    // Helper: named-address alias used when publishing the package
    fun get_admin_address(): address {
        @trm
    }
}

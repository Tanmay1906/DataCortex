// Test file to verify all imports work correctly
import CaseDetailPage from '../pages/cases/CaseDetailPage';
import CaseActions from '../components/cases/detail/CaseActions';
import CaseMetadata from '../components/cases/detail/sections/CaseMetadata';
import EvidenceList from '../components/cases/detail/sections/EvidenceList';
import BlockchainLog from '../components/cases/detail/sections/BlockchainLog';
import UploadEvidence from '../components/cases/detail/sections/UploadEvidence';
import AuditTrail from '../components/cases/detail/sections/AuditTrail';

// Test barrel export
import { 
  CaseDetailPage as CaseDetailPageBarrel,
  CaseActions as CaseActionsBarrel,
  CaseMetadata as CaseMetadataBarrel,
  EvidenceList as EvidenceListBarrel,
  BlockchainLog as BlockchainLogBarrel,
  UploadEvidence as UploadEvidenceBarrel,
  AuditTrail as AuditTrailBarrel
} from '../components/cases/detail';

console.log('All imports successful!');

export default function ImportTest() {
  return null;
}

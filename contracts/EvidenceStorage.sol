// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceStorage {
    address public owner;
    
    mapping(address => bool) public authorizedUploaders;
    mapping(string => mapping(bytes32 => bool)) public evidenceHashes;
    mapping(string => bytes32[]) public caseEvidenceHashes;
    mapping(address => bytes32[]) public uploaderHashes;
    
    event EvidenceLogged(
        string indexed caseId,
        bytes32 indexed evidenceHash,
        address indexed uploadedBy,
        uint256 timestamp
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedUploaders[msg.sender] || msg.sender == owner, "Not authorized to upload evidence");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedUploaders[msg.sender] = true;
    }
    
    function logEvidence(string memory _caseId, bytes32 _evidenceHash) public onlyAuthorized {
        require(!evidenceHashes[_caseId][_evidenceHash], "Evidence hash already exists for this case");
        
        evidenceHashes[_caseId][_evidenceHash] = true;
        caseEvidenceHashes[_caseId].push(_evidenceHash);
        uploaderHashes[msg.sender].push(_evidenceHash);
        
        emit EvidenceLogged(_caseId, _evidenceHash, msg.sender, block.timestamp);
    }
    
    function verifyEvidenceHash(string memory _caseId, bytes32 _evidenceHash) public view returns (bool) {
        return evidenceHashes[_caseId][_evidenceHash];
    }
    
    function getCaseEvidenceHashes(string memory _caseId) public view returns (bytes32[] memory) {
        return caseEvidenceHashes[_caseId];
    }
    
    function getHashesByUploader(address _uploader) public view returns (bytes32[] memory) {
        return uploaderHashes[_uploader];
    }
    
    function setUploader(address _uploader, bool _isAuthorized) public onlyOwner {
        authorizedUploaders[_uploader] = _isAuthorized;
    }
    
    function getBlockTimestamp() public view returns (uint256) {
        return block.timestamp;
    }
    
    function getBlockNumber() public view returns (uint256) {
        return block.number;
    }
}

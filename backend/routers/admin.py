from fastapi import APIRouter, Depends
from services.blockchain import blockchain
from typing import List, Dict

router = APIRouter(tags=["Admin"])

@router.get("/admin/audit-logs")
def get_audit_logs():
    return blockchain.chain

@router.post("/admin/verify-integrity")
def verify_integrity():
    is_valid = blockchain.verify_chain()
    return {"valid": is_valid, "status": "Blockchain Integrity Confirmed" if is_valid else "TAMPERING DETECTED"}

@router.get("/admin/lineage")
def get_data_lineage():
    # Mock Data Lineage Graph
    return {
        "nodes": [
            {"id": "source_1", "label": "Raw Upload", "type": "input"},
            {"id": "process_1", "label": "PII Scrubber", "type": "process"},
            {"id": "process_2", "label": "ML Classifier", "type": "process"},
            {"id": "store_1", "label": "Secure DB", "type": "storage"},
            {"id": "user_1", "label": "Analyst View", "type": "output"},
        ],
        "links": [
            {"source": "source_1", "target": "process_1"},
            {"source": "process_1", "target": "process_2"},
            {"source": "process_2", "target": "store_1"},
            {"source": "store_1", "target": "user_1"},
        ]
    }

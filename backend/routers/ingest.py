from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from services.pii_scanner import redact_pii
from services.ml_engine import ml_engine
import shutil
import os

router = APIRouter(tags=["Ingestion"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/ingest/upload", response_model=schemas.DocumentResponse)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Save file temporarily
    temp_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Read content (assuming text for demo)
    content = ""
    try:
        with open(temp_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        content = "Binary content (not scanned)"
    
    # 3. AI - PII Redaction
    redacted_content = redact_pii(content)
    
    # 4. AI - Classification
    classification = ml_engine.classify_document(redacted_content)
    
    # 5. Save Metadata to DB
    # For demo we don't really have an "Owner" from JWT yet (skipped Auth dependency for speed, but ideally should use it)
    # mocking owner_id = 1
    new_doc = models.Document(
        filename=file.filename,
        file_type=file.content_type,
        is_classified=True,
        classification_level=classification,
        owner_id=1 
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # Overwrite file with redacted content if text
    if content != "Binary content (not scanned)":
        with open(temp_path, "w", encoding="utf-8") as f:
            f.write(redacted_content)
            
    return new_doc

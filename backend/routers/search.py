from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.search_engine import search_engine
from typing import List, Dict

router = APIRouter(tags=["Search"])

@router.get("/search", response_model=List[Dict])
def search_documents(q: str, db: Session = Depends(get_db)):
    return search_engine.search(q, db)

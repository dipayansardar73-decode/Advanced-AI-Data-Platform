import random
from typing import List, Dict
from sqlalchemy.orm import Session
import models

class SearchEngine:
    def __init__(self):
        pass

    def search_local(self, query: str, db: Session) -> List[Dict]:
        """
        Simulate Local Semantic Search:
        Actually does a LIKE search but assigns fake 'similarity scores'.
        """
        # Simple LIKE search
        results = db.query(models.Document).filter(models.Document.filename.contains(query)).all()
        
        # Format and add fake score
        response = []
        for doc in results:
            response.append({
                "source": "Local Database",
                "filename": doc.filename,
                "classification": doc.classification_level,
                "score": round(random.uniform(0.7, 0.99), 2), # Simulated embedding similarity
                "snippet": f"...found term '{query}' in document {doc.filename}..."
            })
        
        # If no results, mock some for demo if query is "money" or "alien"
        if not results and query:
             response.append({
                "source": "Local Database",
                "filename": f"legacy_{query}_record.pdf",
                "classification": "Confidential",
                "score": 0.65,
                "snippet": f"...legacy data regarding {query}..."
            })
            
        return response

    def search_federated(self, query: str) -> List[Dict]:
        """
        Simulate Federated Search (Agency B, Agency C).
        """
        # Mock results based on query
        external_results = []
        if query:
            external_results.append({
                "source": "CIA_PARTNER_NODE_v4",
                "filename": f"INTEL_{query.upper()}_REPORT_2024.pdf",
                "classification": "Top Secret",
                "score": round(random.uniform(0.5, 0.8), 2),
                "snippet": f"External intel detected matching keyword: {query}."
            })
            external_results.append({
                "source": "INTERPOL_DB",
                "filename": f"suspect_tracking_{query}.json",
                "classification": "Sensitive",
                "score": round(random.uniform(0.4, 0.7), 2),
                "snippet": f"Cross-border hits for {query}."
            })
        return external_results

    def search(self, query: str, db: Session) -> List[Dict]:
        local_hits = self.search_local(query, db)
        fed_hits = self.search_federated(query)
        
        # Combined and sorted by score
        all_hits = local_hits + fed_hits
        all_hits.sort(key=lambda x: x['score'], reverse=True)
        return all_hits

search_engine = SearchEngine()

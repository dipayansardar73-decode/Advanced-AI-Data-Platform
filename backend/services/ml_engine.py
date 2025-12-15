import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List, Dict

class MLEngine:
    def __init__(self):
        # Simulation: Pre-trained isolation forest for numeric anomaly detection
        self.iso_forest = IsolationForest(contamination=0.1, random_state=42)
        # Mock training with random data for the demo so it doesn't fail on first prediction
        X_train = np.random.rand(100, 2)
        self.iso_forest.fit(X_train)

    def classify_document(self, text: str) -> str:
        """
        Rule-based classification simulating an NLP model.
        """
        text_lower = text.lower()
        if "secret" in text_lower or "confidential" in text_lower or "password" in text_lower:
            return "Top Secret"
        elif "budget" in text_lower or "financial" in text_lower:
            return "Restricted"
        elif "public" in text_lower or "press" in text_lower:
            return "Public"
        else:
            return "Internal Use Only"

    def detect_anomalies(self, data: List[Dict]) -> List[bool]:
        """
        Detects anomalies in a list of numeric dictionaries (e.g., transaction amounts).
        Expects data to be a list of dicts with 'value' key.
        """
        if not data:
            return []
        
        values = []
        for item in data:
            # simple mock extraction of a numeric value
            val = item.get('amount') or item.get('value') or item.get('score') or 0
            values.append([float(val), 0]) # 2D array for sklearn

        if len(values) < 5:
            return [False] * len(values) # Not enough data

        preds = self.iso_forest.predict(values)
        # -1 is anomaly, 1 is normal
        return [True if p == -1 else False for p in preds]

ml_engine = MLEngine()

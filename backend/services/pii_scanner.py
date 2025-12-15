import re
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None # Fallback if model not loaded

def redact_pii(text: str) -> str:
    """
    Redacts SSN, Email, Phone, and named entities (PERSON) using Spacy + Regex.
    """
    if not text:
        return ""
    
    # 1. Spacy NER for Names (PERSON)
    if nlp:
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                text = text.replace(ent.text, "[PERSON_REDACTED]")
    
    # 2. Regex for SSN (Simple pattern)
    text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[SSN_REDACTED]', text)
    
    # 3. Regex for Email
    text = re.sub(r'[\w\.-]+@[\w\.-]+', '[EMAIL_REDACTED]', text)
    
    # 4. Regex for Phone (US format)
    text = re.sub(r'\b\d{3}-\d{3}-\d{4}\b', '[PHONE_REDACTED]', text)
    
    return text

import spacy
import re
from typing import Dict, Any, List

# Load the small English NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If not downloaded, handle gracefully (should be downloaded in setup)
    print("Warning: en_core_web_sm not found. Falling back to basic regex extraction.")
    nlp = None

def extract_entities(text: str) -> Dict[str, Any]:
    """
    Extracts structured entities from raw text.
    Uses spaCy for NER and regex for emails/phones.
    """
    # Regex patterns
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    
    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    
    structured_data = {
        "personalInfo": {
            "emails": list(set(emails)),
            "phones": list(set(phones))
        },
        "skills": [],
        "experience": [],
        "education": [],
        "projects": []
    }
    
    if nlp is not None:
        doc = nlp(text)
        
        # A very basic heuristic for experience: look for ORG (organizations) and DATE
        organizations = list(set([ent.text for ent in doc.ents if ent.label_ == "ORG"]))
        dates = list(set([ent.text for ent in doc.ents if ent.label_ == "DATE"]))
        
        # In a real production system, this would use a custom trained model for resumes.
        # For now, we populate the raw extractions.
        structured_data["experience_orgs_detected"] = organizations
        structured_data["dates_detected"] = dates
        
        # Extract potential skills (often Nouns or Proper Nouns in tech)
        # We will extract standard noun chunks as potential skills to be normalized later
        potential_skills = []
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 3: # Keep short phrases
                potential_skills.append(chunk.text.lower())
        
        structured_data["skills"] = list(set(potential_skills))
        
    return structured_data

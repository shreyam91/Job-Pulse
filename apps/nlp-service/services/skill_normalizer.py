from rapidfuzz import process, fuzz
from typing import List

# A very basic hardcoded tech ontology.
# In a real system, this would be loaded from a database or a comprehensive dataset.
TECH_ONTOLOGY = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express",
    "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Azure",
    "GCP", "HTML", "CSS", "TailwindCSS", "Next.js", "NestJS", "FastAPI",
    "Django", "Flask", "Machine Learning", "NLP", "PyTorch", "TensorFlow",
    "Scikit-Learn", "Pandas", "NumPy", "SQL", "NoSQL", "Git", "GitHub",
    "CI/CD", "Linux", "Bash", "Java", "Spring Boot", "C++", "C#", ".NET",
    "Ruby", "Ruby on Rails", "Go", "Rust", "PHP", "Laravel", "Vue.js", "Angular"
]

def normalize_skills(raw_skills: List[str], threshold: float = 80.0) -> List[str]:
    """
    Normalizes a list of raw skills against a predefined ontology using RapidFuzz.
    """
    normalized_set = set()
    
    for skill in raw_skills:
        # We compare each extracted string against the ontology
        # extractOne returns a tuple (best_match_string, score, match_index)
        match = process.extractOne(skill, TECH_ONTOLOGY, scorer=fuzz.WRatio)
        
        if match:
            best_match_str, score, _ = match
            if score >= threshold:
                normalized_set.add(best_match_str)
                
    return list(normalized_set)

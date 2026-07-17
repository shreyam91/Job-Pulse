from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
from sklearn.metrics.pairwise import cosine_similarity

# Load the model globally so it's loaded once at startup
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def get_embedding(text: str) -> List[float]:
    """
    Generates a 384-dimensional vector embedding for the input text using all-MiniLM-L6-v2.
    """
    if not model or not text.strip():
        # Fallback to zero vector if model failed to load or text is empty
        return [0.0] * 384
    
    # We truncate or limit text if it's too long, but sentence-transformers handles standard context windows
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

def compute_similarity(emb1: List[float], emb2: List[float]) -> float:
    """
    Computes cosine similarity between two embeddings.
    Returns a score between 0.0 and 1.0 (clamped).
    """
    vec1 = np.array(emb1).reshape(1, -1)
    vec2 = np.array(emb2).reshape(1, -1)
    
    # cosine_similarity returns a 2D array, we want the scalar value
    sim = cosine_similarity(vec1, vec2)[0][0]
    
    # Clamp to [0, 1] range just in case
    return float(max(0.0, min(1.0, sim)))

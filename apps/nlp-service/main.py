from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from services.pdf_parser import extract_text_from_pdf
from services.extractor import extract_entities
from services.skill_normalizer import normalize_skills
from services.embedder import get_embedding, compute_similarity

app = FastAPI(title="AI ATS NLP Microservice")

class JobDescriptionRequest(BaseModel):
    text: str

class EmbedRequest(BaseModel):
    text: str

class SimilarityRequest(BaseModel):
    embedding1: List[float]
    embedding2: List[float]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # 1. Extract text
    content = await file.read()
    raw_text = extract_text_from_pdf(content)
    
    # 2. Extract structured entities (skills, experience, etc.)
    structured_data = extract_entities(raw_text)
    
    # 3. Normalize skills
    if "skills" in structured_data:
        structured_data["normalized_skills"] = normalize_skills(structured_data["skills"])
    
    # 4. Generate embeddings for the whole resume for semantic similarity
    resume_embedding = get_embedding(raw_text)
    
    return {
        "raw_text": raw_text,
        "structured_data": structured_data,
        "embedding": resume_embedding
    }

@app.post("/parse-job")
def parse_job(req: JobDescriptionRequest):
    structured_data = extract_entities(req.text)
    if "skills" in structured_data:
        structured_data["normalized_skills"] = normalize_skills(structured_data["skills"])
    
    job_embedding = get_embedding(req.text)
    return {
        "structured_data": structured_data,
        "embedding": job_embedding
    }

@app.post("/similarity")
def check_similarity(req: SimilarityRequest):
    score = compute_similarity(req.embedding1, req.embedding2)
    return {"similarity_score": score}

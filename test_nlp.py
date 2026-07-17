import requests
import json
import time
import subprocess
import sys
import os

def test_nlp_service():
    try:
        # Test 1: Health Check
        print("Testing /health endpoint...")
        res = requests.get("http://127.0.0.1:8000/health")
        print(f"Status: {res.status_code}")
        print(f"Response: {res.json()}\n")
        
        # Test 2: Parse Resume
        print("Testing /parse-resume endpoint...")
        pdf_path = "test_pdf.pdf"
        with open(pdf_path, "rb") as f:
            files = {"file": ("test_pdf.pdf", f, "application/pdf")}
            res = requests.post("http://127.0.0.1:8000/parse-resume", files=files)
            
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            data = res.json()
            print("Extracted Data (excerpt):")
            print(f"- Raw Text Length: {len(data['raw_text'])}")
            print(f"- Structured Data: {json.dumps(data['structured_data'], indent=2)}")
            print(f"- Embedding dimension: {len(data['embedding'])}")
            resume_emb = data['embedding']
        else:
            print(f"Error: {res.text}")
            resume_emb = None
            
        print("\n")
        
        # Test 3: Parse Job
        print("Testing /parse-job endpoint...")
        job_desc = "We are looking for a Software Engineer with 5 years of experience in Python, React, and Node.js. Must know PostgreSQL."
        res = requests.post("http://127.0.0.1:8000/parse-job", json={"text": job_desc})
        
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            data = res.json()
            print("Extracted Data:")
            print(f"- Structured Data: {json.dumps(data['structured_data'], indent=2)}")
            print(f"- Embedding dimension: {len(data['embedding'])}")
            job_emb = data['embedding']
        else:
            print(f"Error: {res.text}")
            job_emb = None
            
        print("\n")
        
        # Test 4: Similarity
        if resume_emb and job_emb:
            print("Testing /similarity endpoint...")
            res = requests.post("http://127.0.0.1:8000/similarity", json={
                "embedding1": resume_emb,
                "embedding2": job_emb
            })
            print(f"Status: {res.status_code}")
            print(f"Response: {res.json()}\n")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_nlp_service()

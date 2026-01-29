
from fastapi import FastAPI
import os

app = FastAPI(title="microservice")

@app.get("/")
def read_root():
    return {"message": "Hello from microservice!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "db_url": os.getenv("DATABASE_URL", "Not Configured")}

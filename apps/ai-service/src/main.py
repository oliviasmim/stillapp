from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import Settings
from src.routers import embeddings, transcription

settings = Settings()

app = FastAPI(
    title="Still AI Service",
    description="Whisper transcription, embeddings, and semantic resurfacing",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcription.router, prefix="/transcription", tags=["transcription"])
app.include_router(embeddings.router, prefix="/embeddings", tags=["embeddings"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

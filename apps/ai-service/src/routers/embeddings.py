from fastapi import APIRouter
from pydantic import BaseModel

from src.services.embedding_service import EmbeddingService

router = APIRouter()
_service = EmbeddingService()


class EmbedRequest(BaseModel):
    texts: list[str]


class EmbedResponse(BaseModel):
    embeddings: list[list[float]]
    model: str


class SimilarityRequest(BaseModel):
    query: str
    candidates: list[str]
    top_k: int = 5


class SimilarityResult(BaseModel):
    index: int
    score: float
    text: str


class SimilarityResponse(BaseModel):
    results: list[SimilarityResult]


@router.post("/embed", response_model=EmbedResponse)
async def embed_texts(req: EmbedRequest) -> EmbedResponse:
    return await _service.embed(req.texts)


@router.post("/similarity", response_model=SimilarityResponse)
async def find_similar(req: SimilarityRequest) -> SimilarityResponse:
    return await _service.find_similar(req.query, req.candidates, req.top_k)

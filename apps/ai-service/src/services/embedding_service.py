import numpy as np
from openai import AsyncOpenAI

from src.config import Settings

EMBEDDING_MODEL = "text-embedding-3-small"


class EmbeddingService:
    def __init__(self) -> None:
        self._settings = Settings()
        self._client = AsyncOpenAI(api_key=self._settings.openai_api_key)

    async def embed(self, texts: list[str]) -> dict:  # type: ignore[type-arg]
        response = await self._client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts,
        )
        embeddings = [item.embedding for item in response.data]
        return {"embeddings": embeddings, "model": EMBEDDING_MODEL}

    async def find_similar(
        self, query: str, candidates: list[str], top_k: int = 5
    ) -> dict:  # type: ignore[type-arg]
        all_texts = [query] + candidates
        response = await self._client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=all_texts,
        )
        vectors = np.array([item.embedding for item in response.data])
        query_vec = vectors[0]
        candidate_vecs = vectors[1:]

        scores = np.dot(candidate_vecs, query_vec) / (
            np.linalg.norm(candidate_vecs, axis=1) * np.linalg.norm(query_vec) + 1e-10
        )

        top_indices = np.argsort(scores)[::-1][:top_k]
        results = [
            {"index": int(i), "score": float(scores[i]), "text": candidates[i]}
            for i in top_indices
        ]
        return {"results": results}

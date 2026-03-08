import io

from openai import AsyncOpenAI

from src.config import Settings


class TranscriptionService:
    def __init__(self) -> None:
        self._settings = Settings()
        self._client = AsyncOpenAI(api_key=self._settings.openai_api_key)

    async def transcribe(self, audio_bytes: bytes, filename: str) -> dict:  # type: ignore[type-arg]
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = filename

        response = await self._client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
        )

        return {
            "text": response.text,
            "language": getattr(response, "language", None),
            "duration": getattr(response, "duration", None),
        }

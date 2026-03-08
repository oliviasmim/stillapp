from fastapi import APIRouter, HTTPException, UploadFile
from pydantic import BaseModel

from src.services.transcription_service import TranscriptionService

router = APIRouter()
_service = TranscriptionService()


class TranscriptionResponse(BaseModel):
    text: str
    language: str | None = None
    duration: float | None = None


@router.post("/voice", response_model=TranscriptionResponse)
async def transcribe_voice(file: UploadFile) -> TranscriptionResponse:
    if file.content_type not in ("audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"):
        raise HTTPException(status_code=400, detail="Unsupported audio format")
    audio_bytes = await file.read()
    return await _service.transcribe(audio_bytes, filename=file.filename or "audio.webm")

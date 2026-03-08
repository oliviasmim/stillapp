from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    api_internal_secret: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

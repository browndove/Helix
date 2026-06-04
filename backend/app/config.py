from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql://localhost/helix"
    secret_key: str = "dev-secret-change-in-production"
    admin_email: str = "admin@helix.health"
    admin_password: str = "admin"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5500,null"
    upload_dir: str = "uploads"
    api_prefix: str = "/api/v1"
    access_token_expire_minutes: int = 60 * 24

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgresql://") and "+psycopg2" not in url:
            return url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return url

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

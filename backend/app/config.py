from pydantic import BaseSettings, Field
from functools import lru_cache


class LoggingSettings(BaseSettings):
    level: str = Field("INFO", env="LOG_LEVEL")
    format: str = Field(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s", env="LOG_FORMAT"
    )


class Settings(BaseSettings):
    database_user: str = Field(..., env="DATABASE_USER")
    database_password: str = Field(..., env="DATABASE_PASSWORD")
    database_host: str = Field("localhost", env="DATABASE_HOST")
    database_port: int = Field(5432, env="DATABASE_PORT")
    database_name: str = Field(..., env="DATABASE_NAME")
    secret_key: str = Field("your-secret-key", env="SECRET_KEY")  # For future use

    logging: LoggingSettings = LoggingSettings()  # Grouped logging settings

    class Config:
        env_file = ".env.local"
        env_file_encoding = "utf-8"

    def get_db_uri(self) -> str:
        """Construct the database URI from the individual components."""
        return f"postgresql://{self.database_user}:{self.database_password}@{self.database_host}:{self.database_port}/{self.database_name}"

    def get_db_credentials(self) -> dict:
        """Return database credentials as a dictionary."""
        return {
            "user": self.database_user,
            "password": self.database_password,
        }


@lru_cache()
def get_settings() -> Settings:
    return Settings()

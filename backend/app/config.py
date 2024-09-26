from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings
from functools import lru_cache
import sys
import os
from dotenv import load_dotenv


class LoggingSettings(BaseSettings):
    level: str = Field("INFO", env="LOG_LEVEL")
    format: str = Field(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s", env="LOG_FORMAT"
    )


class Settings(BaseSettings):
    app_env: str = "local"
    database_user: str = ""
    database_password: str = ""
    database_host: str = "localhost"
    database_port: int = 5432
    database_name: str = ""
    openai_api_key: str = ""
    root_directory: str = ""

    @classmethod
    def load(cls):
        # Determine the correct .env file
        env_file = cls.get_env_file_path()

        # Load the .env file
        load_dotenv(env_file)

        # Create and return the Settings instance
        return cls(
            app_env=os.getenv("APP_ENV", "local"),
            database_user=os.getenv("DATABASE_USER", ""),
            database_password=os.getenv("DATABASE_PASSWORD", ""),
            database_host=os.getenv("DATABASE_HOST", "localhost"),
            database_port=int(os.getenv("DATABASE_PORT", "5432")),
            database_name=os.getenv("DATABASE_NAME", ""),
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),
            root_directory=os.getenv("ROOT_DIRECTORY", ""),
        )

    @staticmethod
    def get_env_file_path() -> Path:
        app_env = os.getenv("APP_ENV", "local")
        backend_dir = Path(__file__).resolve().parent.parent

        if app_env == "docker":
            return backend_dir / ".env.docker"
        return backend_dir / ".env"

    def get_db_uri(self) -> str:
        return f"postgresql://{self.database_user}:{self.database_password}@{self.database_host}:{self.database_port}/{self.database_name}"

    def get_db_credentials(self) -> dict:
        return {
            "user": self.database_user,
            "password": self.database_password,
        }

    def add_root_to_sys_path(self):
        root_dir = Path(self.root_directory).resolve()
        if str(root_dir) not in sys.path:
            sys.path.append(str(root_dir))


@lru_cache()
def get_settings() -> Settings:
    return Settings.load()

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


def get_database_url() -> str:
    """Build DATABASE_URL from env vars."""
    url = os.getenv("DATABASE_URL")
    if url:
        return url

    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    user = os.getenv("DB_USER", "voyager")
    password = os.getenv("DB_PASSWORD", "voyager-pass")
    name = os.getenv("DB_NAME", "voyager")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


DATABASE_URL = get_database_url()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from sqlalchemy import inspect, text
from CRUD import models
from .database import engine
from .routers import blog, user, authentication


models.Base.metadata.create_all(engine)


def ensure_existing_schema():
    inspector = inspect(engine)
    if "blogs" not in inspector.get_table_names():
        return

    blog_columns = {column["name"] for column in inspector.get_columns("blogs")}
    if "user_id" not in blog_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE blogs ADD COLUMN user_id INTEGER"))


ensure_existing_schema()

app = FastAPI()
app.include_router(blog.router)
app.include_router(user.router)
app.include_router(authentication.router)


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(Path(__file__).parent / "static" / "index.html")

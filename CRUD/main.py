from fastapi import FastAPI
from sqlalchemy.orm import Session
from CRUD import schemas, models
from .database import engine, Base
from .routers import blog, user, authentication


models.Base.metadata.create_all(engine)

app = FastAPI()
app.include_router(blog.router)
app.include_router(user.router)
app.include_router(authentication.router)
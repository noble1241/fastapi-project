from fastAPI import APIRouter, Depends, status, HTTPException, Response
from .. import schemas, models, database
from typing import List
from sqlalchemy.orm import Session
from .. database import get_db
from ..hashing import Hash
from ..repo import user

router = APIRouter(
    prefix="/user",
    tags=['users']
)
get_db = database.get_db

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowUser)
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    return user.create(request, db)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowUser)
def get_user(id: int, db: Session = Depends(get_db)):
    return user.get_user(id, db)
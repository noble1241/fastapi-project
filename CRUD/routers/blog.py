from fastAPI import APIRouter, Depends, status, HTTPException, Response
from .. import schemas, models, database, oauth2
from typing import List
from sqlalchemy.orm import Session
from .. database import get_db
from ..repo import blog

router = APIRouter(
    prefix="/blog",
    tags=['blogs']
)
get_db = database.get_db


@router.get("/", response_model=List[schemas.ShowBlog], status_code=status.HTTP_200_OK)
def get_all_blogs(db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog.get_all(db)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_blog(request: schemas.Blog, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog.create(request, db)

@router.get("/{id}", status_code=status.HTTP_200_OK)
def get_blog(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog.get_blog(id, db)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog.delete(id, db)

@router.put("/{id}", status_code=status.HTTP_202_ACCEPTED, response_model=schemas.ShowBlog)
def update_blog(id: int, request: schemas.Blog, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog.update(id, request, db)


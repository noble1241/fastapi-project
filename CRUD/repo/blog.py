from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException, status, Response

def get_all(db: Session):
    blogs = db.query(models.Blog).all()
    return blogs

def create(request: schemas.Blog, db: Session, current_user: models.User):
    blog = models.Blog(title=request.title, body=request.body, user_id=current_user.id)
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog

def delete(id: int, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    db.delete(blog)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

def get_blog(id: int, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    return blog

def update(id: int, request: schemas.Blog, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    blog.title = request.title
    blog.body = request.body
    db.commit()
    db.refresh(blog)
    return blog

from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class BlogBase(BaseModel):
    title: str
    body: str

class Blog(BlogBase):
    model_config = ConfigDict(from_attributes=True)
        
class User(BaseModel):
    name: str
    email: str
    password: str

class ShowUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    blogs: List[Blog] = []
        
class ShowBlog(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    body: str
    creator: Optional[ShowUser] = None
        
class Login(BaseModel):
    username: str
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

from urllib import request

from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
import uvicorn

app = FastAPI()

class Person(BaseModel):
    name: str
    age: int
    email: Optional[str] = None

@app.get("/")
async def root():
    return {'data': {'name': 'nick', 'age': 20}}

@app.get("/test/{id}")
async def test(id: int):
    return {'data': {'id': id}}

@app.get("/test")
async def index(limit: int = 10, want: bool = True, sort: Optional[str] = None):
    if want:
        return {'data': f'the limit is {limit} and want is {want}'}
    else:
        return {'data': f'the limit is {limit}'}

@app.post("/test")
async def create_item(request: Person):
    if request.email:
        return {'data': f'created person with name {request.name}, age {request.age}, and email {request.email}.'}
    else:
        return {'data': f'created person with name {request.name}, age {request.age}.'}

if __name__ == "__main__":
    uvicorn.run("CRUD.main:app", host="127.0.0.1", port=8000, reload=True)
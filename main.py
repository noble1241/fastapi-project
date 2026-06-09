from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {'data': {'name': 'nick', 'age': 18}}

@app.get("/hello")
async def hello():
    return {"message": "hello world"}
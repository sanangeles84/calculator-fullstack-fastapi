from logging import info
from dotenv import dotenv_values
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

config = dotenv_values(".env")

# secure approach
#port = config.get("PORT") or 8000
#print(f"{port=}")
#origins = [
    # f"http://localhost:{port}",
    # f"http://localhost:{port}/api",
    # f"http://127.0.0.1:{port}",
    # f"http://127.0.0.1:{port}/api"
#]

# insecure approach to simplify configuration and launch, ok just because it's a sample project,
# for proper security use the approach commented above
origins = ["*"]


app = FastAPI(title="App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_app = FastAPI(title="API")
app.mount("/api", api_app)
app.mount("/", StaticFiles(directory="static", html=True), name="static")


@api_app.middleware("http")
async def check_api_key(request: Request, call_next):
    if request.headers.get("authorization").replace("Bearer ", "") != config.get("API_KEY"):
        return JSONResponse(status_code=401, content={ "status": "Unauthorized" })
    else:
        return await call_next(request)


class Item(BaseModel):
    text: str
    is_done: bool = False

items = []


@api_app.get("/")
def root():
    return {"Hello":"World"}

class Result(BaseModel):
    result: float

@api_app.get("/sum/{num1}/{num2}", response_model=Result)
def return_sum(num1 : float, num2 : float):
    return Result( result = num1 + num2)


@api_app.get("/subtract/{num1}/{num2}", response_model=Result)
def subtract(num1 : float, num2 : float):
    return Result( result = num1 - num2)


@api_app.get("/multiply/{num1}/{num2}", response_model=Result)
def	multiply(num1 : float, num2 : float):
    return Result( result = num1 * num2)


@api_app.get("/divide/{num1}/{num2}", response_model=Result)
def	divide(num1 : float, num2 : float):
    if num2 == 0:
        return JSONResponse(status_code=400, content={"status":"Illegal Operation: Cannot divide by 0"})
    else:
        return Result( result = num1 / num2)
	
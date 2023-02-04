from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from databases import Database
from fastapi import FastAPI

IMAGE_STORE="/home/sammy/stable-diffusion-webui/outputs/txt2img-images"

database = Database("sqlite:///images.db")

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/pics", StaticFiles(directory=IMAGE_STORE), name="pics")

@app.on_event("startup")
async def database_connect():
    await database.connect()


@app.on_event("shutdown")
async def database_disconnect():
    await database.disconnect()

@app.get("/images/")
async def fetch_images():
    query = "SELECT * FROM image ORDER BY path DESC LIMIT 40"
    results = await database.fetch_all(query=query)
    return results

@app.get("/images/{page_num}")
async def fetch_images(page_num: int):
    offset = page_num * 40;
    query = "SELECT * FROM image ORDER BY path DESC LIMIT 40 OFFSET {}".format(str(offset))
    results = await database.fetch_all(query=query)
    return results
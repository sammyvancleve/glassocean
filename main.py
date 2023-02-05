from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from databases import Database
from fastapi import FastAPI
from pydantic import BaseModel
from index import index_dir

IMAGE_STORE="/home/sammy/stable-diffusion-webui/outputs/txt2img-images"

database = Database("sqlite:///images.db")

app = FastAPI()

class ImageFlag(BaseModel):
    image_id: int
    flag: int

#origins = [
    #"http://localhost:5173",
#]
origins = ["*"]

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
    offset = page_num * 40
    query = "SELECT * FROM image ORDER BY path DESC LIMIT 40 OFFSET {}".format(str(offset))
    results = await database.fetch_all(query=query)
    return results

@app.get("/index/")
async def index():
    index_dir(IMAGE_STORE, "images.db")

@app.get("/fetchflagged")
async def fetch_flagged_images(page_num: int, flag: int):
    offset = page_num * 40
    query = "SELECT * FROM IMAGE WHERE flag = " + format(str(flag)) + " ORDER BY path DESC LIMIT 40 OFFSET " + format(str(offset))
    results = await database.fetch_all(query=query)
    return results

@app.post("/flagimage/")
async def flag_image(image_flag: int, image_id: int):
    query = "UPDATE image SET flag = " + format(str(image_flag)) + " WHERE id = " + format(str(image_id)) + ";"
    print(query)
    results = await database.execute(query)
    return results
from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from databases import Database
from fastapi import FastAPI
from pydantic import BaseModel
from send2trash import send2trash
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
async def fetch_images(page_num: int = Query(default=0), sort_option: str = Query(default="path"), 
                       model: str = Query(default=None), seed: str = Query(default=None),
                       rating: int = Query(default=None), flag: str = Query(default=None)):
    offset = page_num * 40
    query = "SELECT * from image "
    options = [
        {'param': 'rating', 'value': rating},
        {'param': 'flag', 'value': flag},
    ]
    options = [x for x in options if x['value'] != None]
    if model != None:
        options.append({'param': 'model', 'value': '\'' + model + '\''})
    if seed != None:
        options.append({'param': 'seed', 'value': '\'' + seed + '\''})
    for option in options:
        query += "WHERE " + format(str(option['param'])) + "=" + format(str(option['value'])) + " "
        if (len(options) > 1):
            query += "AND "
    query += "ORDER BY " + format(str(sort_option)) + " DESC LIMIT 40 OFFSET " + format(str(offset))
    results = await database.fetch_all(query=query)
    return results

@app.get("/models/")
async def fetch_models():
    query = "SELECT DISTINCT model FROM image"
    results = await database.fetch_all(query=query)
    return results

@app.get("/index/")
async def index():
    index_dir(IMAGE_STORE, "images.db")

@app.post("/flagimage/")
async def flag_image(image_flag: int, image_id: int):
    query = "UPDATE image SET flag = " + format(str(image_flag)) + " WHERE id = " + format(str(image_id)) + ";"
    results = await database.execute(query)
    return results

@app.post("/rateimage/")
async def rate_image(rating: int, image_id: int):
    query = "UPDATE image SET rating = " + format(str(rating)) + " WHERE id = " + format(str(image_id)) + ";"
    results = await database.execute(query)
    return results

@app.post("/removeimage/")
async def remove_image(image_id: int):
    query = "SELECT * from image WHERE id=" + format(str(image_id))
    results = await database.fetch_all(query)
    imagepath = results[0][1]
    print(IMAGE_STORE + "/" + format(str(imagepath)))
    try:
        send2trash(IMAGE_STORE + "/" + format(str(imagepath)))
    except:
        print("error deleting file")
    query = "DELETE FROM image WHERE id=" + format(str(image_id))
    results = await database.execute(query)
    return results
from setupdb import create_tables
from index import index_dir

IMAGE_STORE = "/home/sammy/stable-diffusion-webui/outputs/txt2img-images"
DB_STORE="images.db"

create_tables(DB_STORE)
index_dir(IMAGE_STORE, DB_STORE)
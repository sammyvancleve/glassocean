from setupdb import create_tables
from index import index_dir

IMAGE_STORE="."
DB_STORE="images.db"

create_tables(DB_STORE)
index_dir(IMAGE_STORE, DB_STORE)
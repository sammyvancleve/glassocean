from setupdb import create_tables
from index import index_dir

create_tables("images.db")
index_dir(".", "images.db")
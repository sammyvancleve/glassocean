import sqlite3, os
from PIL import Image
con = sqlite3.connect("images.db")

cur = con.cursor()
#In sqlite, INTEGER primary keys are not null
cur.execute('''CREATE TABLE IF NOT EXISTS image(
    id INTEGER PRIMARY KEY, 
    path TEXT NOT NULL,
    prompt TEXT,
    modelHash TEXT, 
    model TEXT,
    steps INTEGER, 
    samplerId INTEGER, 
    cfg INTEGER,
    seed INTEGER, 
    size TEXT, 
    rating INTEGER, 
    flag INTEGER, 
    dateCreated TEXT)''')
cur.execute('''CREATE TABLE IF NOT EXISTS prompt(
    id INTEGER PRIMARY KEY, 
    promptText TEXT)''')
cur.execute('''CREATE TABLE IF NOT EXISTS imageprompt(
    id INTEGER PRIMARY KEY,
    imageId INTEGER,
    promptId INTEGER, 
    weight INTEGER, 
    placement INTEGER,
    FOREIGN KEY(imageId) REFERENCES image(id),
    FOREIGN KEY(promptId) REFERENCES prompt(id))''')
cur.execute('''CREATE TABLE IF NOT EXISTS model(
    id INTEGER PRIMARY KEY, 
    name TEXT, 
    path TEXT, 
    desription TEXT, 
    hash TEXT, 
    rating INTEGER)''')

directory = os.fsencode('.')

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".png"):
        path = filename
        im = Image.open(filename)
        metadata = im.info
        metadata = metadata['parameters']
        splitmetadata = metadata.splitlines()
        prompt = splitmetadata[0] + " ## " + splitmetadata[1]
        otherinfo = splitmetadata[2].split(", ")
        imagedict = {} 
        imagedict['Filename'] = filename
        for info in otherinfo: 
            splitinfo = info.split(": ",1)
            imagedict[splitinfo[0]] = splitinfo[1]
        print(imagedict)
        cur.execute('''INSERT INTO image(path, prompt, seed, size, model) values (?,?,?,?,?)''', 
            (path, prompt, imagedict['Seed'], imagedict['Size'], imagedict['Model']))
        con.commit()
import sqlite3

def create_tables(db_path):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    #In sqlite, INTEGER primary keys are not null
    cur.execute('''CREATE TABLE IF NOT EXISTS image(
        id INTEGER PRIMARY KEY, 
        path TEXT NOT NULL UNIQUE,
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
    con.commit()
    con.close()
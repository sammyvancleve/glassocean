import sqlite3, os
from PIL import Image
import time

def index_dir(dir, db):
    con = sqlite3.connect(db)
    cur = con.cursor()
    directory = os.fsencode(dir)
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(".png"):
            #print(filename)
            #print(os.path.join(os.getcwd(), dir + filename))
            #im = Image.open(os.fsdecode(os.path.abspath(file)))
            rel_path = os.path.join(os.getcwd(), dir + "/" + filename)
            print(os.fsdecode(rel_path))
            #im = Image.open(os.path.join(os.getcwd(), dir + "/" + filename))
            im = Image.open(os.fsdecode(rel_path))
            #im = Image.open(rel_path.decode("utf_8"))
            #im = Image.open(dir + filename)
            metadata = im.info
            metadata = metadata['parameters']
            splitmetadata = metadata.splitlines()
            prompt = splitmetadata[0] + " ## " + splitmetadata[1]
            otherinfo = splitmetadata[2].split(", ")
            imagedict = {} 
            imagedict['Filename'] = filename
            imagedict['dateCreated'] = time.ctime(os.path.getctime(rel_path))
            #imagedict['dateCreated'] = time.ctime(os.path.getctime(file))
            for info in otherinfo: 
                splitinfo = info.split(": ",1)
                imagedict[splitinfo[0]] = splitinfo[1]
            cur.execute('''INSERT OR IGNORE INTO image(
                path, prompt, seed, size, model, dateCreated, modelHash, steps, cfg, rating, flag) 
                values (?,?,?,?,?,?,?,?,?,0,0)''', 
                (filename, prompt, imagedict['Seed'], imagedict['Size'], 
                imagedict['Model'], imagedict['dateCreated'], 
                imagedict['Model hash'], imagedict['Steps'], imagedict['CFG scale']))
            con.commit()
    con.close()
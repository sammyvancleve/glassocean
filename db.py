import sqlite3, os
from PIL import Image
con = sqlite3.connect("images.db")

cur = con.cursor()
#cur.execute("CREATE TABLE IF NOT EXISTS image(imageId, path, modelId, seed, rating, flag, prompt, dateCreated)")
cur.execute("CREATE TABLE IF NOT EXISTS image(imageId, path, prompt, modelHash, steps, samplerId, cfg, seed, size, rating, flag, dateCreated)")
cur.execute("CREATE TABLE IF NOT EXISTS prompt(promptId, text)")
cur.execute("CREATE TABLE IF NOT EXISTS imageprompt(imageId, promptId, weight, placement)")
cur.execute("CREATE TABLE IF NOT EXISTS model(modelId, name, path, desription, hash, rating)")

directory = os.fsencode('.')

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".png"):
        im = Image.open(filename)
        metadata = im.info
        metadata = metadata['parameters']
        splitmetadata = metadata.splitlines()
        prompt = splitmetadata[0] + " ## " + splitmetadata[1]
        otherinfo = splitmetadata[2].split(", ")
        imagedict = {} 
        for info in otherinfo: 
            splitinfo = info.split(": ",1)
            image_info[splitinfo[0]] = splitinfo[1]

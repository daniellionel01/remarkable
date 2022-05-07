import os
import sys
import requests
import time

PROTOCOL = "http"
IP = "10.11.99.1"
TIMESTAMP = int(time.time())
TARGET = f"./remarkable-{TIMESTAMP}"

def get(path):
    url = f"{PROTOCOL}://{IP}{path}"
    print(url)
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "Host": "10.11.99.1",
        "Origin": "http://10.11.99.1",
        "Referer": "http://10.11.99.1/",
    }
    res = requests.get(url, headers=headers)
    return res

def download(obj, path=None):
    _id = obj["ID"]
    _type = obj["Type"]
    name = obj["VissibleName"]
    name = name.replace("/", "-")

    if path == None:
        path = TARGET

    if _type == "DocumentType":
        docpath = os.path.join(path, f"{name}.pdf")
        pdf = get(f"/download/{_id}/placeholder")
        with open(docpath, "wb") as f:
            f.write(pdf.content)
    elif _type == "CollectionType":
        dirpath = os.path.join(path, name)
        if not os.path.exists(dirpath):
            os.mkdir(dirpath)

        subdocs = get(f"/documents/{_id}/").json()
        for subdoc in subdocs:
            download(subdoc, dirpath)

def main():
    if not os.path.exists(TARGET):
        os.mkdir(TARGET)

    docs = get("/documents/").json()
    for doc in docs:
        download(doc)

if __name__ == "__main__":
    main()

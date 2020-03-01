import time
import requests
import os
from typing import *
from atom import Atom
from pathlib import Path

module_uuid = "com.sarimabbas.website"
module_name = "website"

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

path_to_binary = os.path.join(__location__, "SingleFile/cli/single-file")


def create(url: str, path: str):
    # instantiate an atom
    atom = Atom()

    # fetch website if exists
    request = requests.get(url)
    if request.status_code != 200:
        return None

    # fmt: off
    res = atom.update(
        {
        "module": {
            "id": module_uuid,
            "name": module_name, 
            "fetch_time" : time.time(),
            "url": request.url,
            "page" : "./page.html"
        }
    })
    # fmt: on

    # save the atom
    atom.save(path)

    # download and save the HTML asset
    os.system(
        f"{path_to_binary} {url} {path + '/page.html'} --browser-executable-path /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
    )

    return "success"


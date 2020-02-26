import time
import requests
from typing import *
from atom import Atom

module_uuid = "com.sarimabbas.website"
module_name = "website"


class Website:
    def create(url: str) -> Atom:
        # instantiate an atom
        atom = Atom()

        # atom.state.module.id = uuid
        # atom.state.module.name = "website"

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
                "url": request.url
            }
        })
        # fmt: on

        if res:
            return atom
        return None

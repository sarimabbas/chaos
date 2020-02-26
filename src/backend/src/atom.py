import json
import copy
from pathlib import Path
from typing import *


class Atom:
    def __init__(self):

        # this is the
        self.spec = {
            # general metadata
            "path": "",
            "filename": "",
            # system metadata
            "system": {
                "st_size": 0,  # integer Unix time
                "st_mtime": 0,  # integer Unix time
                "st_ctime": 0,  # integer Unix time
            },
            # shared metadata for all atoms, where possible
            "shared": {
                # general organization (e.g. Kanban board)
                "category": "",  # single string
                "tags": [],  # list of strings
                # for todo functionality
                "completed": False,  # boolean
                "deadline": 0,  # integer Unix time
            },
            "module": {
                "id": "",  # UUID string i.e. which module created it
                "name": "",  # Name of that module
                # module-specific properties below, e.g.
                # "assetsPath" : "",
                # "apiToken" : ""
            },
        }

        # this is the mutable state
        self.state = copy.deepcopy(self.spec)

    def update(self, rep: Dict) -> bool:
        # copy the original state
        save: Dict = copy.deepcopy(self.state)
        # apply the changes to the state
        save.update(rep)
        # check if the update parses correctly
        if self._parseRepresentation(save):
            self.state = save
            return True
        else:
            return False

    def load(self, path: str) -> bool:
        bundlePath: Path = Path(path).expanduser()
        # the very first thing is that the atom must be a directory, not a binary file
        if not bundlePath.is_dir():
            return False
        # the next thing is to check if the file has a manifest.json
        nextPaths = bundlePath.iterdir()
        found = False
        for p in nextPaths:
            if "manifest.json":
                found = True
                break
        if not found:
            return False
        # the next thing is to parse the manifest to JSON
        parsed: str = None
        manifestPath = bundlePath / "manifest.json"
        parsed = json.loads(manifestPath.read_text())
        if not parsed:
            return False
        # parse it to make sure it meets the spec
        if not self._parseRepresentation(parsed):
            return False
        # once all the checks are done, update state
        self.state = parsed
        return True

    def save(self, path: str) -> bool:
        # path to the bundle
        bundlePath: Path = Path(path).expanduser()
        # create the bundle if it doesnt exist
        bundlePath.mkdir(parents=True, exist_ok=True)
        # create a manifest file inside of it
        manifestPath = bundlePath / "manifest.json"
        # first check if representation is fine
        if not self._parseRepresentation(self.state):
            manifestPath.write_text(json.dumps({"error": "invalid atom"}))
            return False
        else:
            manifestPath.write_text(json.dumps(self.state))
            return True

    def toJSON(self):
        return json.dumps(self.state)

    def __str__(self):
        return str(self.toJSON())

    def _parseRepresentation(self, rep: Dict) -> bool:

        # first, see if it meets the valid spec
        for key in list(self.spec.keys()):
            firstLevelOfParsedKeys = list(rep.keys())
            if not key in firstLevelOfParsedKeys:
                return False
        # manually check the other layers
        try:
            check = rep["system"]["st_size"]
            check = rep["system"]["st_mtime"]
            check = rep["system"]["st_ctime"]
            check = rep["shared"]["category"]
            check = rep["shared"]["tags"]
            check = rep["shared"]["completed"]
            check = rep["shared"]["deadline"]
        except:
            return False
        return True

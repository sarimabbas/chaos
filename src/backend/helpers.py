import os
import json
from pathlib import Path
import json
from typing import Dict


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
        self.state = {**self.spec}

    def parseRepresentation(self, rep: Dict) -> bool:

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

    def readRepresentation(self, path: str) -> Dict:
        bundlePath: Path = Path(path).expanduser()
        # the very first thing is that the atom must be a directory, not a binary file
        if not bundlePath.is_dir():
            return {}
        # the next thing is to check if the file has a manifest.json
        nextPaths = bundlePath.iterdir()
        found = False
        for p in nextPaths:
            if "manifest.json":
                found = True
                break
        if not found:
            return {}
        # the next thing is to parse the manifest to JSON
        parsed: str = None
        manifestPath = bundlePath / "manifest.json"
        parsed = json.loads(manifestPath.read_text())
        if not parsed:
            return {}
        # parse it to make sure it meets the spec
        if not self.parseRepresentation(parsed):
            return {}
        # once all the checks are done, return the parsed JSON
        return parsed

    def writeRepresentation(self, rep: Dict, path: str):
        # path to the bundle
        bundlePath: Path = Path(path).expanduser()
        # create the bundle if it doesnt exist
        bundlePath.mkdir(parents=True, exist_ok=True)
        # create a manifest file inside of it
        manifestPath = bundlePath / "manifest.json"
        # first check if representation is fine
        if not self.parseRepresentation(rep):
            manifestPath.write_text(json.dumps({"error": "invalid atom"}))
        else:
            manifestPath.write_text(json.dumps(rep))


def filePicker(window, dialogType):
    result = window.create_file_dialog(dialog_type=dialogType)
    if result:
        return result[0]
    else:
        return ""


def recursivelyGetPaths(curPath: str):
    curPath: Path = Path(curPath).expanduser()
    return recursivelyGetPathsHelper(curPath)


def recursivelyGetPathsHelper(curPath: Path):

    # stat result
    stat = curPath.stat()
    commonProp = {
        "path": str(curPath),
        "name": curPath.name,
        "show": True,
        "system": {
            "st_size": stat.st_size,
            "st_mtime": stat.st_mtime,
            "st_ctime": stat.st_ctime,
        },
    }

    # if leaf node, return
    if curPath.is_file():
        return {
            **commonProp,
            "type": "file",
            "children": [],
        }

    # if parent node, recurse
    if curPath.is_dir():
        nextPaths = curPath.iterdir()
        return {
            **commonProp,
            "type": "directory",
            "children": [recursivelyGetPathsHelper(p) for p in nextPaths],
            "showChildren": False,
        }


if __name__ == "__main__":
    myAtom = Atom()
    from pprint import pprint

    pprint(myAtom.spec)
    result = myAtom.readRepresentation("~/Downloads/hello.atom")
    print(result)

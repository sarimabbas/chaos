import os
import json
from pathlib import Path
import json
import webbrowser
from typing import Dict
from atom import Atom


def filePicker(window, dialogType):
    result = window.create_file_dialog(dialog_type=dialogType)
    if result:
        return result[0]
    else:
        return ""


def recursivelyGetPaths(curPath: str):
    path: Path = Path(curPath).expanduser()
    return recursivelyGetPathsHelper(path)


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
        "selected": False,
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

        # if file extension is one of the following, don't recurse
        fileExtensions = [".crncl", ".chaos", ".sa490"]
        if curPath.suffix in fileExtensions:
            return {
                **commonProp,
                "type": "file",
                "children": [],
            }

        nextPaths = curPath.iterdir()
        return {
            **commonProp,
            "type": "directory",
            "children": [recursivelyGetPathsHelper(p) for p in nextPaths],
            "showChildren": False,
        }


def openURL(url: str):
    webbrowser.open_new_tab(url)


def readFile(strPath: str) -> str:
    path: Path = Path(strPath).expanduser()
    if path.exists():
        if path.is_file():
            return path.read_text(encoding="utf-8")
        elif path.suffix in [".chaos", ".sa490", ".crncl"]:
            atom = Atom()
            atom.load(strPath)
            return str(atom)
    return ""


# if __name__ == "__main__":
#     myAtom = Atom()
#     from pprint import pprint

#     pprint(myAtom.spec)
#     result = myAtom.readRepresentation("~/Downloads/hello.atom")
#     print(result)

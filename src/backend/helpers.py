import os
import json
from pathlib import Path


def fileRead(pathToFile: str):
    pathToFile: Path = Path(pathToFile).expanduser()


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

    # if leaf node, return
    if curPath.is_file():
        return {
            "path": str(curPath),
            "children": [],
            "type": "file",
            "name": curPath.name,
            "show": True,
        }

    nextPaths = curPath.iterdir()

    # if parent node, recurse
    if curPath.is_dir():
        return {
            "path": str(curPath),
            "type": "directory",
            "children": [recursivelyGetPathsHelper(p) for p in nextPaths],
            "name": curPath.name,
            "showChildren": False,
            "show": True,
        }


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


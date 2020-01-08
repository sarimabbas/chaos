import os
import json
from pathlib import Path


class API:
    def init(self):
        pass

    def recursivelyGetPaths(self, curPath: str):
        curPath: Path = Path(curPath).expanduser()
        return self.recursivelyGetPathsHelper(curPath)

    def recursivelyGetPathsHelper(self, curPath: Path):

        # if leaf node, return
        if curPath.is_file():
            return {
                "path": str(curPath),
                "children": [],
                "type": "file",
                "name": curPath.name,
            }

        nextPaths = curPath.iterdir()

        # if parent node, recurse
        if curPath.is_dir():
            return {
                "path": str(curPath),
                "type": "directory",
                "children": [self.recursivelyGetPathsHelper(p) for p in nextPaths],
                "name": curPath.name,
                "showChildren": False,
            }

    def logger(self, msg):
        print(msg)


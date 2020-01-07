from pathlib import Path


def writeBundle(self, path: str, contents) -> None:
    p = Path(path)
    # p must be a bundle format .crncl, which is a directory
    with open(path, "w") as f:
        f.write(contents)


def readBundle(self, path: str) -> str:
    with open(path) as f:
        content: str = f.read()
        return content


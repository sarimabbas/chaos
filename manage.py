#!/usr/bin/env python3

import os
import sys
import argparse
from pathlib import Path

# the script will work no matter where it is called from
os.chdir(Path(__file__).parent.absolute())


def main():
    # parse args
    parser = argparse.ArgumentParser(description="Optional app description")
    parser.add_argument("--dev", action="store_true", help="Run in development mode")
    parser.add_argument("--build", action="store_true", help="Build app for production")
    args = parser.parse_args()

    if args.dev:
        return dev()

    if args.build:
        return build()

    print("No mode specified.")
    return


def dev():
    print("Starting development mode...")
    os.system(
        f"(sleep 10 && ./src/backend/venv/bin/python ./src/backend/main.py) & (yarn --cwd ./src/frontend/ serve) && fg"
    )


def build():
    print("Starting build...")
    # BUILD FRONTEND
    # os.system(f"npm run build --prefix ../frontend") --> creates a build
    os.system(f"yarn --cwd ./src/frontend build")  # --> creates a dist

    # BUILD BACKEND
    # remove the dist folder created by py2app at top level
    os.system("rm -rf ./dist")

    # chdir to the backend folder for py2app
    os.chdir("./src/backend")

    # build py2app by first removing build folder,
    # then running py2app from venv and relocating to dist
    os.system(
        """
      rm -rf build/ &&
      venv/bin/python setup.py py2app &&
      mv dist/ ../../dist
      """
    )


if __name__ == "__main__":
    main()


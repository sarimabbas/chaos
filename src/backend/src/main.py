import webview
import argparse
import sys
import os
import threading
import logging
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import helpers
from atom import Atom

# from modules.website import module as website
from modules.website.module import Website

# from .components.modules import website


# from modules.website.website import fetchWebsite

app = Flask(__name__, template_folder="dist", static_folder="dist/static")
CORS(app)


@app.route("/api/pathfinder")
def pathFinder():
    startPath = request.args.get("path", default="")
    print(startPath)
    allPaths = helpers.recursivelyGetPaths(startPath)
    return jsonify(allPaths)


@app.route("/api/filepicker")
def filePicker():
    if window:
        typeOfDialog = request.args.get("type", default="folder", type=str)
        if typeOfDialog == "folder":
            paths = helpers.filePicker(window, webview.FOLDER_DIALOG)
        elif typeOfDialog == "file":
            paths = helpers.filePicker(window, webview.OPEN_DIALOG)
        elif typeOfDialog == "save":
            paths = helpers.filePicker(window, webview.SAVE_DIALOG)
        else:
            return jsonify({})
        return jsonify(paths)
    else:
        return jsonify({})


@app.route("/api/open-url")
def openURL():
    url = request.args.get("url", default=None, type=str)
    if url:
        helpers.openURL(url)
    return ""


@app.route("/api/write-json-to-file", methods=["POST"])
def writeJSONToFile():
    response = request.json
    print(response)
    path = response["path"]
    data = response["data"]
    print(data)
    a = Atom()
    res = a.update(data)
    if res:
        res = a.save(path)
        if res:
            return "Success"
    return "Error"


# module routes
@app.route("/api/modules/website/create")
def modules_website_create():
    url = request.args.get("url", default=None, type=str)
    print(url)
    if url:
        return Website.create(url).toJSON()
    return ""


@app.route("/api/read-file")
def readFile():
    path = request.args.get("path", default=None, type=str)
    if path:
        content = helpers.readFile(path)
        return content
    return "Error"


# BASIC SETUP

FLASK_PORT = 5000
VUE_DEV_PORT = 8080


def start_server():
    app.run(host="localhost", port=FLASK_PORT)


@app.route("/")
def index():
    # in dev mode, just return string (use Vue web serve instead)
    if args.debug:
        return "In debug mode. Check frontend port."
    # in prod, return the compiled template
    return render_template("index.html")


def parseArgs():
    parser = argparse.ArgumentParser(description="Run backend")
    parser.add_argument(
        "--debug", action="store_true", help="Whether to run in debug mode"
    )
    args = parser.parse_args()
    return args


window = None


if __name__ == "__main__":
    args = parseArgs()

    # dump errors to logs
    logging.basicConfig(filename="error.log", level=logging.DEBUG)

    # run server in separate thread
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()

    # create window
    if args.debug:
        window = webview.create_window(
            "Chaos", f"http://localhost:{VUE_DEV_PORT}/", text_select=True
        )
    else:
        window = webview.create_window(
            "Chaos", f"http://localhost:{FLASK_PORT}/", text_select=True
        )

    # start web view with dev tools always enabled
    webview.start(debug=True)

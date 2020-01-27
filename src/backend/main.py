import webview
import argparse
import sys
import os
import threading
import logging
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import helpers

app = Flask(__name__, template_folder="dist", static_folder="dist/static")
CORS(app)

window = None


def parseArgs():
    parser = argparse.ArgumentParser(description="Run backend")
    parser.add_argument(
        "--debug", action="store_true", help="Whether to run in debug mode"
    )
    args = parser.parse_args()
    return args


@app.route("/")
def index():
    if args.debug:
        return "In debug mode. Check frontend port."
    return ""
    return render_template("index.html")


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


def start_server():
    if args.debug:
        app.run(host="localhost", port=5000, debug=True)
    else:
        app.run(host="localhost", port=5000)


if __name__ == "__main__":
    args = parseArgs()
    print(args)

    logging.basicConfig(filename="error.log", level=logging.DEBUG)

    # in debug, only run flask
    # in prod, run flask and create the webview
    # if args.debug:
    #     start_server()
    # else:
    # start flask in separate thread
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    # start webview
    window = webview.create_window(
        "Chaos", "http://localhost:8080/", text_select=True
    )
    webview.start(debug=True)

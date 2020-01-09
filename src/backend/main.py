import webview
import argparse
import sys
import os
import threading
import logging
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from api import API

app = Flask(__name__, template_folder="dist", static_folder="dist/static")
api = API()
CORS(app)


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
    return render_template("index.html")


@app.route("/api/paths")
def getPaths():
    paths = api.recursivelyGetPaths("~/Developer/chaos")
    return jsonify(paths)


def start_server():
    if args.debug:
        app.run(host="localhost", port=5000, debug=True)
    else:
        app.run(host="localhost", port=5000)


if __name__ == "__main__":
    args = parseArgs()
    print(args)

    # in debug, only run flask
    # in prod, run flask and create the webview
    if args.debug:
        logging.basicConfig(filename="error.log", level=logging.DEBUG)
        start_server()
    else:
        # start flask in separate thread
        t = threading.Thread(target=start_server)
        t.daemon = True
        t.start()
        # start webview
        window = webview.create_window(
            "Chaos", "http://localhost:5000/", text_select=True
        )
        webview.start()

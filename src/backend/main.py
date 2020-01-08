import webview
import argparse
import sys
import os
import threading
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
        return "In debug mode"
    return render_template("index.html")


@app.route("/api/paths")
def getPaths():
    paths = api.recursivelyGetPaths("~/Developer/chaos")
    return jsonify(paths)


def start_server():
    app.run(host="localhost", port=5000)


if __name__ == "__main__":
    args = parseArgs()
    print(args)

    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()

    import logging

    logging.basicConfig(filename="error.log", level=logging.DEBUG)

    if args.debug:
        window = webview.create_window(
            "Chaos", url="http://localhost:8080/", js_api=api, text_select=True
        )
        webview.start(debug=True)
    else:
        window = webview.create_window(
            "Chaos", "http://localhost:5000/", js_api=api, text_select=True
        )
        webview.start()

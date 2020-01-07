import webview
import argparse
import sys
import os
from api import API


def parseArgs():
    parser = argparse.ArgumentParser(description="Run backend")
    parser.add_argument(
        "--debug", action="store_true", help="Whether to run in debug mode"
    )
    args = parser.parse_args()
    return args


if __name__ == "__main__":
    args = parseArgs()
    print(args)
    api = API()

    if args.debug:
        window = webview.create_window(
            "Chaos", url="http://localhost:8080/", js_api=api, text_select=True
        )
        webview.start(debug=True)
    else:
        window = webview.create_window(
            "Chaos", "./dist/index.html", js_api=api, text_select=True
        )
        # with open(os.path.expanduser("~/Downloads/hello.txt"), "w") as f:
        #     f.write("\n".join(sys.argv))
        webview.start(http_server=True)

# coding = utf-8
from flask import Flask, send_from_directory, request, jsonify
import logging

app = Flask(__name__)

@app.route('/rivers', methods = ['POST'])
def pos():
    json = request.get_json(force = True)
    logging.warning(json['square'])
    return jsonify(request.get_json(force = True))

@app.route('/')
def ini():
    return "Hello"

if __name__ == "__main__":
    app.run(debug = True)

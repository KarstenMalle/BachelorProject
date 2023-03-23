import os
import json
import requests
import base64
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

GITLAB_CLIENT_ID = 'f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d'
GITLAB_CLIENT_SECRET = 'dd6412781504b99616d536aa40ceebd98a9ffd9e660c2ca54e013717e77738d0'
GITLAB_ACCESS_TOKEN = 'glpat-xkEugG82zf3agsz-KBb1'
GITLAB_PROJECT_ID = '44544934'


def has_permission(username, microservice_name):
    encoded_path = f"Auth%2F{username}%2Fpermissions.txt"
    gitlab_api_url = f"https://gitlab.com/api/v4/projects/{GITLAB_PROJECT_ID}/repository/files/{encoded_path}?ref=main"
    headers = {"Authorization": f"Bearer {GITLAB_ACCESS_TOKEN}"}

    response = requests.get(gitlab_api_url, headers=headers)

    if response.status_code == 404:
        app.logger.debug(f"Permissions file not found for user {username}")
        return False
    elif response.status_code != 200:
        app.logger.error(f"Error getting permissions file from GitLab API: {response.status_code}")
        return False

    file_content_base64 = json.loads(response.text)["content"]
    file_content = base64.b64decode(file_content_base64).decode("utf-8")
    permissions = file_content.split("\n")
    
    app.logger.debug(f"User {username} permissions: {permissions}")

    return microservice_name in permissions



@app.route("/auth", methods=["GET"])
def auth():
    try:
        access_token = request.headers.get("Authorization", "").split(" ")[-1]

        if not access_token:
            abort(401)

        gitlab_api_url = "https://gitlab.com/api/v4/user"
        headers = {"Authorization": f"Bearer {access_token}"}

        response = requests.get(gitlab_api_url, headers=headers)

        if response.status_code != 200:
            abort(403)

        user_info = response.json()
        username = user_info["username"]

        if not has_permission(username, "microservice1"):
            abort(403)

        return jsonify(user_info)
    except Exception as e:
        app.logger.exception("Error in auth endpoint")
        abort(500)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8090)

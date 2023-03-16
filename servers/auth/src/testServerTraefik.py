from flask import Flask, request, abort

app = Flask(__name__)

@app.route('/')
def index():
    user = request.headers.get('X-Forwarded-User')
    if user:
        return f"Hello {user}! You are authenticated!"
    else:
        abort(401, description="You are not authenticated")

if __name__ == '__main__':
    app.run(host='localhost', port=4001)
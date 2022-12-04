import os
from flask import Flask, request

app = Flask(__name__)


@app.route('/webhooks/push', methods=['POST'])
def on_push():
    print(request)


app.run()

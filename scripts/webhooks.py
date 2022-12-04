import os
from flask import Flask, request

app = Flask(__name__)
path = '/workspace/mcart-scheduler'

@app.route('/webhooks/push', methods=['POST'])
def on_push():
    os.system(f'cd {path} && git checkout production && git pull && npm run deploy')
    return 'Done'


app.run()

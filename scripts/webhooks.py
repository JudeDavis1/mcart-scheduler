import os
from flask import Flask, request

app = Flask(__name__)
path = '/workspace/mcart-scheduler'

@app.route('/webhooks/push', methods=['POST'])
def on_push():
    print(request.get_json())
    os.system(f'cd {path} && git checkout production && git pull && npm run build && sh startup.sh')
    return 'Done'


app.run()

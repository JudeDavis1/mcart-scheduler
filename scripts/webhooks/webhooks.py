import os
from flask import Flask, request

app = Flask(__name__)
path = '/workspace/mcart-scheduler'

@app.route('/webhooks/push', methods=['POST'])
def on_push():
    if request.get_json()['ref'] != 'refs/heads/production':
        print('This isn\'t production')
        return 'Is not production'

    os.system('killall node')
    os.system(f'''
        cd {path} &&
        git checkout production &&
        git pull origin production -f &&
        npm i &&
        rm -rf build* &&
        npx tsc &&
        npm run deploy
    ''')
    print('Deployed')
    return 'Deployed.'


app.run(host='0.0.0.0', port=8080)

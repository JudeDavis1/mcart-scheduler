# This starts up the project (frontend and backend) in the background as services
nohup node ./workspace/server.js &
nohup serve -s build -l 80 &

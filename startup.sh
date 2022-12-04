# This starts up the project (frontend and backend) in the background as services
sudo nohup node ./workspace/server.js &
sudo nohup serve -s build -l 80

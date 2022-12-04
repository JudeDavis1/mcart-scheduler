#!/bin/bash
# This starts up the project (frontend and backend) in the background as services
sudo nohup ./workspace/server.js &
sudo nohup serve -s build -l 80

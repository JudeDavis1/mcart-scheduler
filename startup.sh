# This starts up the project (frontend and backend) in the background as services
nohup node ./build-backend/server.js &
nohup serve -s build -l 80 &

echo "Initial setup completed. You can now press ENTER..."

#!/bin/bash

# Kill Nodemon First
# kill -9 $(lsof -ti :3011)

sleep 1

# Check if the screen session "webhooks" is already running
if screen -ls | grep -q "webhooks"; then
    # If it is running, reattach to the existing session, stop nodemon, and then run deploy.sh
    screen -S webhooks -X stuff $'\003 && ./deploy.sh' # Sending Ctrl+C (SIGINT and bash)
    sleep 2
    screen -S webhooks -X stuff './deploy.sh\n'
else
    # If it is not running, start a new session and execute the deploy script
    screen -S webhooks -d -m bash -c 'bash ./deploy.sh'
fi

#!/bin/bash

# Kill Nodemon First
pkill -f "nodemon"

# Check if the screen session "webhooks" is already running
if screen -ls | grep -q "webhooks"; then
    # If it is running, reattach to the existing session, stop nodemon, and then run deploy.sh
    screen -S webhooks -X stuff 'bash ./deploy.sh\n'
else
    # If it is not running, start a new session and execute the deploy script
    screen -S webhooks -d -m bash -c 'bash ./deploy.sh'
fi

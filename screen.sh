#!/bin/bash

# Check if the screen session "webhooks" is already running
if screen -ls | grep -q "webhooks"; then
    # If it is running, reattach to the existing session, stop nodemon, and then run deploy.sh
    screen -S webhooks -X stuff 'pkill -f "nodemon" && sleep 1 && ./deploy.sh\n'
else
    # If it is not running, start a new session and execute the deploy script
    screen -S webhooks -d -m bash -c 'pkill -f "nodemon" && sleep 1 && ./deploy.sh'
fi

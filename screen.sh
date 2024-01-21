#!/bin/bash

# Check if the screen session "webhooks" is already running
if screen -ls | grep -q "webhooks"; then
    # If it is running, reattach to the existing session
    screen -r webhooks -X stuff './deploy.sh\n'
else
    # If it is not running, start a new session and execute the deploy script
    screen -S webhooks -d -m bash -c './deploy.sh'
fi
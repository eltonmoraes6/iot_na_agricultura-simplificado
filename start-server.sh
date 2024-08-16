#!/bin/bash

# Prompt the user to choose the server mode
echo "Enter the server mode you want to run:"
echo "1. Development"
echo "2. Production"
read -r mode

# Set the hyve-api and frontend directory paths as variables
API_DIR="/backend"
FRONTEND_DIR="/frontend"

# Set the server commands based on the chosen mode
if [ "$mode" == "1" ]; then
    SERVER_COMMAND="yarn dev"
elif [ "$mode" == "2" ]; then
    SERVER_COMMAND="yarn start"
else
    echo "Invalid input. Please run the script again and choose a valid option."
    exit 1
fi

# Change to the server directory and start the backend server in the background
cd "$API_DIR" || exit 1
eval "$SERVER_COMMAND" &

# Change to the frontend directory and start the frontend server
cd "$FRONTEND_DIR" || exit 1
eval "$SERVER_COMMAND"

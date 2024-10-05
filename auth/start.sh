#!/bin/bash



# Function to handle SIGTERM
cleanup() {
    echo "Caught SIGTERM signal. Terminating child processes..."
    
    # Send SIGTERM to all child processes
    kill -- -$$
    
    # Exit after sending the signal
    exit 0
}

# Trap SIGTERM signal
trap 'cleanup' SIGTERM

# Example of spawning child processes

# Starts the gRPC server in the background
python3 -m grpc_server.server &

# Starts the gunicorn server 
gunicorn --config gunicorn.conf.py app:app &

wait 

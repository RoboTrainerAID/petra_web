#!/bin/sh

echo "Run Container (Dev Mode)"
xhost + local:root


# Detect Operating System
OS="$(uname -s)"

if [ "$OS" = "Linux" ]; then
    echo "Running on Linux (using --net host)..."
    docker run \
      --rm \
      -it \
      --name petra_web \
      --env-file .env \
      -p 3000:3000 \
      -v "$(pwd)":/home/node/petra_web \
      -v /home/node/petra_web/node_modules \
      petra_web:dev
else
    echo "Running on macOS (using port mapping)..."
    docker run  \
        --rm \
        -it \
        --name petra_web \
        --add-host=host.docker.internal:host-gateway \
        --env-file .env.macos \
        --privileged \
        -p 3000:3000 \
        -v "$(pwd)":/home/node/petra_web \
        -v /home/node/petra_web/node_modules \
        petra_web:dev
fi
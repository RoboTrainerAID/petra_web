#!/bin/sh

echo "Run Container"
xhost + local:root
docker run \
    -P \
    --name petra_web \
    -it --privileged \
    --net host \
    -e DISPLAY=$DISPLAY \
    -e REACT_APP_FLASK_BACKEND_URL=http://172.31.1.235:5000 \
    --rm \
    petra_web:nodejs14

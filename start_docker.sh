#!/bin/sh

echo "Run Container"
xhost + local:root
docker run \
  -p 3000:3000 \
  --name petra_web \
  -it \
  -e DISPLAY=$DISPLAY \
  -e REACT_APP_FLASK_BACKEND_URL=http://localhost:5000 \
  --rm \
  petra_web:nodejs14

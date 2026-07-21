#!/bin/sh

echo "Run Container"
xhost + local:root

docker run \
  --rm \
  -it \
  --name petra_web \
  -p 3000:3000 \
  -v "$(pwd)":/home/node/petra_web \
  -v /home/node/petra_web/node_modules \
  petra_web:dev

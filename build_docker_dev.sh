#!/bin/sh
docker build \
  -t petra_web:dev \
  --build-arg="BACKEND_URL=http://localhost:5001" \
  -f Dockerfile.dev .

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

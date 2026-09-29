#!/bin/sh
docker build -t petra_web:nodejs14 --build-arg="BACKEND_URL=http:/192.168.1.5:5001" .

echo "Run Container"
xhost + local:root
docker run \
  -p 3000:3000 \
  --name petra_web \
  -it \
  --rm \
  petra_web:nodejs14

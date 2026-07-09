#!/bin/sh
docker build -t petra_web:nodejs14 --build-arg="BACKEND_URL=http://localhost:5000" .

echo "Run Container"
xhost + local:root
docker run -P --name petra_web -it --privileged --net host -e DISPLAY=$DISPLAY --rm petra_web:nodejs14

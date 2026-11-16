#!/bin/sh
docker build \
  -t petra_web:dev \
  --build-arg="BACKEND_URL=http://192.168.1.2:5000" \
  -f Dockerfile.dev \
  .

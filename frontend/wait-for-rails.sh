#!/bin/bash
until curl --silent --fail http://localhost:3000/api/v1/up | grep -q '{"status":"OK"}'; do
  echo "Waiting for Rails server to start..."
  sleep 1
done
echo "Ok, rails server is up and running - let's start testing!"
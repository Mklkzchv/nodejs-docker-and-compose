#!/bin/bash
# wait-for-it.sh

host=$1
port=$2
shift 2

until nc -z $host $port; do
  echo "Waiting for $host:$port to be ready..."
  sleep 1
done

echo "$host:$port is ready!"
exec "$@"

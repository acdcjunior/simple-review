#!/usr/bin/env sh

# Substitute environment variables
export DOLLAR='$'
envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Run nginx
nginx -g "daemon off;"
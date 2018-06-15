#!/bin/bash -e

### render the template
envtpl -o /etc/nginx/nginx.conf /nginx.conf.tpl
exec "$@"


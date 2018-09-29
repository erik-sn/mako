#!/usr/bin/env bash

telepresence --swap-deployment api --expose 8000  --docker-run  -it -p 8000:8000 -v $(pwd)/api:/code --entrypoint "/bin/bash" mako_api:latest
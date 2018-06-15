#!/bin/bash

echo "Starting celery circus service"
envtpl /etc/circus/celery.ini.tpl
circusd /etc/circus/celery.ini


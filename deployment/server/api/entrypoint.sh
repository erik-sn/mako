#!/bin/bash

echo "Starting API circus service"
# for some resaon this fixes pg bouncer not finding the host name
echo "options randomize-case:0" >> /etc/resolv.conf
envtpl /etc/pgbouncer/pgbouncer.ini.tpl
envtpl /etc/circus/api.ini.tpl
circusd /etc/circus/api.ini


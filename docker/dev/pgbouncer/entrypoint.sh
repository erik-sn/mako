#!/bin/bash
set -e

bash -c "exec pgbouncer -u postgres /etc/pgbouncer/pgbouncer.ini"
[circus]
endpoint = tcp://127.0.0.1:5555
pubsub_endpoint = tcp://127.0.0.1:5556
stats_endpoint = tcp://127.0.0.1:5557

[watcher:django]
working_dir = /code
cmd = /usr/local/bin/gunicorn core.wsgi:application -b tcp://0.0.0.0:8000 -k gthread --threads={{ GUNICORN_THREAD_COUNT }} -w {{ GUNICORN_WORKER_COUNT }} -t {{ GUNICORN_TIMEOUT }}
use_sockets = True
singleton = True
copy_env = True
copy_path = True
uid = django
gid = django
numprocesses = 1

[watcher:pgbouncer]
cmd = /usr/sbin/pgbouncer -u django /etc/pgbouncer/pgbouncer.ini
use_sockets = True
singleton = True
uid = django
gid = django
numprocesses = 1

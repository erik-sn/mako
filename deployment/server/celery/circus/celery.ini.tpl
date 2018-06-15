[circus]
endpoint = tcp://127.0.0.1:5555
pubsub_endpoint = tcp://127.0.0.1:5556
stats_endpoint = tcp://127.0.0.1:5557

[watcher:celery]
working_dir = /code
cmd = celery worker -A core.celery -l warning
use_sockets = True
singleton = True
copy_env = True
copy_path = True
uid = django
gid = django
numprocesses = 1


[databases]
postgres = host={{ PGBOUNCER_HOST }} port={{ PGBOUNCER_PORT }} user={{ POSTGRES_USER }} password={{ POSTGRES_PASSWORD }}

[pgbouncer]

logfile = /var/log/postgresql/pgbouncer.log
pidfile = /etc/pgbouncer/pgbouncer.pid

; ip address or * which means all ip-s
;listen_addr = 127.0.0.1
listen_port = 6432

; unix socket is also used for -R.
; On debian it should be /var/run/postgresql
unix_socket_dir = /etc/pgbouncer
unix_socket_mode = 0777

; any, trust, plain, crypt, md5
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

pool_mode = transaction

_reset_query =
server_reset_query_always = 0

;
; When taking idle server into use, this query is ran first.
;   SELECT 1
;
;server_check_query = select 1

; If server was used more recently that this many seconds ago,
; skip the check query.  Value 0 may or may not run in immediately.
server_check_delay = 60

;;;
;;; Connection limits
;;;

; total number of clients that can connect
max_client_conn = 500

; default pool size.  20 is good number when transaction pooling
default_pool_size = 200

; how many additional connection to allow in case of trouble
reserve_pool_size = 30

; log if client connects or server connection is made
log_connections = 0

; log if and why connection was closed
log_disconnections = 0


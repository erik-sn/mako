# T3 MSL

worker_processes {{ NGINX_WORKER_PROCESSES }};
worker_rlimit_nofile {{ NGINX_WORKER_RLIMIT }};

events {
        worker_connections {{ NGINX_WORKER_CONNECTIONS }};
        multi_accept on;
        use epoll;
        accept_mutex on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 60;
        keepalive_requests 100000;
        reset_timedout_connection on;

        types_hash_max_size 2048;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Buffer Dials (We don't know how we feel about this yet.)
        ##

        client_body_buffer_size      128k;
        client_header_buffer_size    1k;
        large_client_header_buffers  4 4k;
        output_buffers               1 32k;
        postpone_output              1460;

        ##
        # Gzip Settings
        ##

        gzip on;
        gzip_disable "msie6";

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Timeouts
        ##

        client_header_timeout  3m;
        client_body_timeout    3m;
        send_timeout           3m;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        ##
        # Virtual Host Configs
        ##

        # Setup Socket Endpoint
        upstream web {
            server api:8000 fail_timeout=0;
        }

        # log_format  graylog2_format  '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for" <msec=$msec|connection=$connection|connection_requests=$connection_requests|millis=$request_time>';

        # HTTP
        server {
            listen 80;
            # listen 443 ssl default_server;

            # ssl_certificate      /server.crt;
            # ssl_certificate_key  /server.key;

            # ssl_session_cache shared:SSL:1m;
            # ssl_session_timeout  5m;

            server_name localhost _;
            server_tokens off;

            location / {
                try_files $uri @proxy_to_app;
            }

            location /static/ {
                include  /etc/nginx/mime.types;
                alias /assets/;
            }

            location ^~ /admin/ { # restrict access to admin section
                proxy_set_header X-Forwarded-Protocol $scheme;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass_header X-Forwarded-Host;
                proxy_set_header Host $http_host;
                proxy_redirect off;

        #        if (!$adminokay) {
        #          return 403;
        #        }

                proxy_pass http://web;
            }

            location @proxy_to_app {
                proxy_set_header X-Forwarded-Protocol $scheme;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass_header X-Forwarded-Host;
                proxy_set_header Host $http_host;
                proxy_redirect off;

                proxy_pass http://web;
            }
        }
}


FROM nginx


RUN apt-get update -qq && \
    apt-get install -yq python-dev python-setuptools python-pip && \
    pip install envtpl

ARG NGINX_WORKER_PROCESSES
ARG NGINX_WORKER_RLIMIT
ARG NGINX_WORKER_CONNECTIONS

ENV NGINX_WORKER_PROCESSES ${NGINX_WORKER_PROCESSES}
ENV NGINX_WORKER_RLIMIT ${NGINX_WORKER_RLIMIT}
ENV NGINX_WORKER_CONNECTIONS ${NGINX_WORKER_CONNECTIONS}

COPY ./entrypoint.sh /
COPY ./nginx.conf.tpl /

EXPOSE 80:80

RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


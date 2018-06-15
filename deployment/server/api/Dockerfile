FROM python:3.6
ENV PYTHONUNBUFFERED 1

# Create service user
RUN useradd -ms /bin/bash django

# update ubuntu packages
RUN    set -x && \
        # update apt-get repo
        apt-get -qq update && \
        # install packages
        apt-get install -yq --no-install-recommends \
            pgbouncer && \
        # purge apt-get files. but why?
        apt-get purge -y --auto-remove && \
        rm -rf /var/lib/apt/lists/* && \
        pip --no-input install circus && \
        pip install envtpl

# set up working directory and install dependencies
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt

# add the rest of the project structure
ADD . /code/

# set up log directories
RUN mkdir -p /var/log/gunicorn && chown django /var/log/gunicorn
RUN mkdir -p /var/log/postgres && chown django /var/log/postgres
RUN chown -R django /var/log/

# pgbouncer config
COPY ./deployment/server/api/pgbouncer /etc/pgbouncer/
RUN chown -R django /etc/pgbouncer/

# add circus config
COPY ./deployment/server/api/circus/ /etc/circus/
RUN chown -R django /etc/circus/

# add the entrypoint startup script
COPY ./deployment/server/api/entrypoint.sh /

# make it executable
RUN ["chmod", "+x", "/entrypoint.sh"]
RUN ["rm", "/etc/pgbouncer/pgbouncer.ini"]
ENTRYPOINT [ "/entrypoint.sh" ]
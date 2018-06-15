FROM python:3.6
ENV PYTHONUNBUFFERED 1

# copy project files & code to /project dir
RUN mkdir /project
WORKDIR /project
ADD . /project/

# delete beat pid if we've already started this once
RUN rm -f /project/celerybeat.pid

# install dependencies
RUN pip install -r requirements.txt

# set up the entrypoint for celery
COPY ./deployment/dev/celery/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /project

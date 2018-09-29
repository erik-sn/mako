FROM python:3.6
ENV PYTHONUNBUFFERED 1

# copy project files & code to /code dir
RUN mkdir /code
WORKDIR /code
ADD . /code/

# delete beat pid if we've already started this once
RUN rm -f /code/celerybeat.pid

# install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./docker/celery/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

WORKDIR /code




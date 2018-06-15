FROM python:3.6
ENV PYTHONUNBUFFERED 1

# necessary for psycopg2
#RUN apk update && \
#    apk --no-cache add gcc python-dev musl-dev && \
#    apk add postgresql-dev

# copy project files & code to /project dir
RUN mkdir /project
WORKDIR /project
ADD . /project/

# install dependencies
RUN pip install -r requirements.txt

# set up the entrypoint to run migrations
WORKDIR /project

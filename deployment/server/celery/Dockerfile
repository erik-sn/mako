FROM python:3.6
ENV PYTHONUNBUFFERED 1

# Create service user
RUN useradd -ms /bin/bash django

# set up working directory and install dependencies
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt

# add the rest of the project structure
ADD . /code/

# add circus config
COPY ./deployment/server/celery/circus/ /etc/circus/
RUN chown -R django /etc/circus/

# add the entrypoint startup script
COPY ./deployment/server/celery/entrypoint.sh /

# make it executable
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT [ "/entrypoint.sh" ]
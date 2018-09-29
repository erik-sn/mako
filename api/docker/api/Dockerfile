FROM python:3.6
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN set -xe \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl socat \
    && apt-get install -y --no-install-recommends xvfb x11vnc fluxbox xterm unzip libnss3 libgconf-2-4 \
    && apt-get install -y --no-install-recommends sudo \
    && apt-get install -y --no-install-recommends supervisor \
    && rm -rf /var/lib/apt/lists/*

# install google chrome
RUN set -xe \
    && curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*


# Install chromedriver for Selenium
RUN curl https://chromedriver.storage.googleapis.com/2.36/chromedriver_linux64.zip -o /usr/local/bin/chromedriver.zip
RUN unzip /usr/local/bin/chromedriver.zip -d /usr/local/bin
RUN chmod +x /usr/local/bin/chromedriver


# copy project files & code to /code dir
RUN mkdir /code
WORKDIR /code
ADD . /code/

# install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./docker/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

WORKDIR /code

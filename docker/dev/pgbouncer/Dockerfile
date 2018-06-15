FROM postgres:10.0

RUN apt-get update
RUN apt-get install -y pgbouncer

ADD pgbouncer.ini /etc/pgbouncer/pgbouncer.ini
ADD userlist.txt /etc/pgbouncer/userlist.txt

RUN chown -R postgres /etc/pgbouncer
RUN chown -R postgres /var/log/postgresql
RUN chown -R postgres /var/run/postgresql

# set up the entrypoint to run migrations
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 6432

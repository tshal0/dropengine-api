FROM postgres:13 AS build

# Custom initialization scripts
COPY ./create_db.sh /docker-entrypoint-initdb.d/20-create_db.sh
COPY init.sql /init.sql

RUN chmod +x /docker-entrypoint-initdb.d/20-create_db.sh
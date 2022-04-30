#!/bin/bash
set -e

POSTGRES="psql --username ${DB_USER}"

echo "Creating database: ${DB_NAME}"

$POSTGRES <<EOSQL
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
EOSQL

echo "Initializing schema..."
psql -d ${DB_NAME} -a -U ${DB_USER} -f /init.sql

# echo "Populating database..."
# psql -d ${DB_NAME} -a  -U${DB_USER} -f /data.sql
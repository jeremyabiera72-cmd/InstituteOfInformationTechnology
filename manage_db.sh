#!/usr/bin/env bash

DB_DIR="/home/yumi/Documents/cs-student-hub/db_data"
LOG_FILE="$DB_DIR/logfile"
PORT=5433
DB_NAME="cs_student_hub"
USER="postgres"

case "$1" in
  init)
    echo "Initializing database cluster at $DB_DIR..."
    if [ -d "$DB_DIR" ]; then
      echo "Error: Database directory $DB_DIR already exists."
      exit 1
    fi
    initdb -D "$DB_DIR" -U "$USER" --auth-local=trust --auth-host=trust
    echo "Database cluster initialized."
    ;;
  start)
    echo "Starting PostgreSQL on port $PORT..."
    if ! [ -d "$DB_DIR" ]; then
      echo "Error: Database not initialized. Run './manage_db.sh init' first."
      exit 1
    fi
    pg_ctl -D "$DB_DIR" -o "-p $PORT" -l "$LOG_FILE" start
    echo "PostgreSQL started."
    ;;
  stop)
    echo "Stopping PostgreSQL..."
    pg_ctl -D "$DB_DIR" stop
    echo "PostgreSQL stopped."
    ;;
  status)
    pg_ctl -D "$DB_DIR" status
    ;;
  createdb)
    echo "Creating database '$DB_NAME'..."
    createdb -h localhost -p "$PORT" -U "$USER" "$DB_NAME"
    echo "Database '$DB_NAME' created."
    ;;
  *)
    echo "Usage: $0 {init|start|stop|status|createdb}"
    exit 1
    ;;
esac

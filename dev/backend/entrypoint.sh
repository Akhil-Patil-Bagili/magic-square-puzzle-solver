#!/bin/sh

echo "Running database migrations"
flask db upgrade

if [ "$FLASK_ENV" = "development" ]; then
  exec flask run --host=0.0.0.0
else
  exec gunicorn --bind 0.0.0.0:5000 wsgi:app
fi

FROM python:3.11.8

WORKDIR /usr/src/app

COPY . .

ARG ENVIRONMENT=development
COPY .env.${ENVIRONMENT} .env

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install gunicorn

COPY entrypoint.sh /usr/src/app
RUN chmod +x /usr/src/app/entrypoint.sh

RUN ls -la /usr/src/app/

EXPOSE 5000

ENV FLASK_APP=app

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]

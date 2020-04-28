FROM python:3.7.7-alpine

RUN apk update && apk add g++ && apk add curl
RUN pip install Flask
RUN pip install UnleashClient
RUN pip install requests

COPY app.py ./app.py
COPY static ./static

CMD flask run -p 5000 -h 0.0.0.0

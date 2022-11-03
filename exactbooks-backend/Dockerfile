FROM --platform=$BUILDPLATFORM python:3.7-alpine AS builder
WORKDIR /app 
COPY requirements.txt /app
RUN apk update
RUN apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install --upgrade pip
RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add postgresql \
    && apk add postgresql-dev \
    && pip install psycopg2 \
    && apk add jpeg-dev zlib-dev libjpeg \
    && pip install Pillow \
    && apk del build-deps
RUN pip3 install -r requirements.txt --no-cache-dir
RUN apk add curl
RUN curl --create-dirs -o $HOME/.postgresql/root.crt -O https://cockroachlabs.cloud/clusters/36ad5902-5296-4696-9727-96c1d34af15a/cert
COPY . /app 

CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "core.wsgi:application"]
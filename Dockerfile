FROM ubuntu:22.04

MAINTAINER Guillermo Jimenez "geonexus@gmail.com", Noel Ruiz "noelrl@gmail.com"


# Install Node 1.19
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN apt update && apt upgrade
RUN apt install curl gnupg2 gnupg -y
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
RUN apt install nodejs

RUN mkdir -p /app

# Copy our Angular web
COPY . /app

WORKDIR /app/
RUN npm install --save-dev
RUN  npm install -g @angular/cli
WORKDIR  /app/angular-based-project/

# Install MapLibre GL
RUN npm install maplibre-gl @types/maplibre-gl

ENTRYPOINT ['ng serve']

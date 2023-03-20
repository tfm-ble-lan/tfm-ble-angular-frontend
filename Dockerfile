FROM ubuntu:22.04

MAINTAINER Guillermo Jimenez "geonexus@gmail.com", Noel Ruiz "noelrl@gmail.com"

# Install Node 1.19
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV PORT 80

RUN apt update -y && apt upgrade -y
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

ENTRYPOINT ["ng"]
CMD ["serve", "--port", "80", "--host", "0.0.0.0"]

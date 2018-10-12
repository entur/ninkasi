FROM node:6.3
# https://hub.docker.com/_/node/

# https://github.com/Yelp/dumb-init
RUN wget --quiet https://github.com/Yelp/dumb-init/releases/download/v1.0.1/dumb-init_1.0.1_amd64.deb
RUN dpkg -i dumb-init_*.deb
RUN npm set progress=false

EXPOSE 8000
ENV port 8000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm build

CMD [ "dumb-init", "npm", "run", "prod" ]

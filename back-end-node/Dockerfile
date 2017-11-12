FROM node:8-alpine

MAINTAINER acdcjunior

RUN mkdir -p /opt/simplereview-backend/app /opt/simplereview-backend/config
WORKDIR /opt/simplereview-backend/app

# We first add just package*.json, so NPM INSTALL is only needed when they change
COPY package.json /opt/simplereview-backend/app
COPY package-lock.json /opt/simplereview-backend/app
RUN npm install

COPY . /opt/simplereview-backend/app
RUN ./node_modules/.bin/tsc

VOLUME /opt/simplereview-backend/config

EXPOSE 3000

CMD npm run couchdb-setup && npm start
FROM node:8-alpine

MAINTAINER acdcjunior

RUN mkdir -p /opt/simplereview-backend/app /opt/simplereview-backend/config
WORKDIR /opt/simplereview-backend/app

# We first add just package*.json, so NPM INSTALL is only needed when they change
COPY package.json /opt/simplereview-backend/app
COPY package-lock.json /opt/simplereview-backend/app
RUN npm install

COPY tsconfig.json /opt/simplereview-backend/app
COPY app.js /opt/simplereview-backend/app

VOLUME /opt/simplereview-backend/app/bin
VOLUME /opt/simplereview-backend/app/public
VOLUME /opt/simplereview-backend/app/routes
VOLUME /opt/simplereview-backend/app/src
VOLUME /opt/simplereview-backend/app/views

EXPOSE 3000

CMD ./node_modules/.bin/tsc && npm run couchdb-setup && npm start & (sleep 5; ./node_modules/.bin/tsc --watch)
FROM node:8-alpine

MAINTAINER acdcjunior

RUN mkdir -p /opt/simplereview-frontend/app
WORKDIR /opt/simplereview-frontend/app

# We first add just package*.json, so NPM INSTALL is only needed when they change
COPY package.json /opt/simplereview-frontend/app/
COPY package-lock.json /opt/simplereview-frontend/app/
RUN npm install

COPY . /opt/simplereview-frontend/app

VOLUME /opt/simplereview-frontend/app/build
VOLUME /opt/simplereview-frontend/app/src
VOLUME /opt/simplereview-frontend/app/test
VOLUME /opt/simplereview-frontend/app/vendor


EXPOSE 5000

# CMD npm run dev
CMD npm run build && npm run servir
FROM node:8-alpine

MAINTAINER acdcjunior

RUN mkdir -p /front-end
WORKDIR /front-end

# Inserimos primeiro somente o package.json, pra dar o npm install somente se ele mudar
COPY package.json /front-end/
RUN npm install

COPY . /front-end
RUN npm run build

EXPOSE 5000

CMD npm run servir
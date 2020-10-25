FROM node:12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

RUN npm install -g yarn --force

RUN npm config set registry http://registry.npmjs.org

ADD package.json /app/package.json

ADD yarn.lock /app/yarn.lock

RUN yarn

ADD . /app

EXPOSE 3000 9229

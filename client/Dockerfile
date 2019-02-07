FROM node:11.9-alpine

WORKDIR /usr/local/src
ADD package.json yarn.lock /usr/local/src/
RUN yarn install

ADD . /usr/local/src
EXPOSE 3000

CMD ["yarn", "start"]
FROM node:24-alpine

EXPOSE 3000

WORKDIR /app
ADD package*.json .
RUN npm ci

ADD . .

CMD ["npm", "start"]

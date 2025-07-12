FROM node:24-alpine

WORKDIR /app
ADD package*.json .
RUN npm ci

ADD . .

EXPOSE 5173

CMD ["npm", "start"]

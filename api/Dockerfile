FROM oven/bun:alpine

WORKDIR /app
ADD package.json bun.lock ./
RUN bun install

ADD . .

EXPOSE 3000

CMD ["bun", "start"]

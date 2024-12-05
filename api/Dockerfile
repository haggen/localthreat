FROM golang:1.21-alpine

RUN apk add --no-cache build-base git 
RUN go install github.com/pilu/fresh@latest

WORKDIR /usr/local/src
ADD . /usr/local/src

EXPOSE 5000

CMD ["fresh"]

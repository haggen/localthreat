FROM golang:1.11.5-alpine

RUN apk add --no-cache build-base git 
RUN go get github.com/pilu/fresh

WORKDIR /usr/local/src
ADD . /usr/local/src

ENV GO111MODULE on
EXPOSE 8080

CMD ["fresh"]
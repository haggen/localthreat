NAME=localthreat
CGO_ENABLED=0
GOOS=linux
build: fmt vet
	@go build -o $(NAME) .
static: fmt vet
	@go build -a -ldflags '-extldflags "-static"' -o $(NAME) .
test: fmt vet
	@go test ./...
fmt: main.go
	@go fmt ./...
vet: main.go
	@go vet ./...
.PHONY: vet fmt test watch

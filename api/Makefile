CGO_ENABLED=0
GOOS=linux
default: fmt vet
	@go build -o localthreat .
static: fmt vet
	@go build -a -ldflags '-extldflags "-static"' -o localthreat .
test: fmt vet
	@go test ./...
fmt: main.go
	@go fmt ./...
vet: main.go
	@go vet ./...
.PHONY: vet fmt test run

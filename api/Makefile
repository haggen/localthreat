localthreat: fmt vet
	@go build -o localthreat .
run: fmt vet
	@go run main.go
test: fmt vet
	@go test ./...
fmt:
	@go fmt ./...
vet:
	@go vet ./...
.PHONY: vet fmt test run

package web

import (
	"net/http"

	"github.com/google/uuid"
)

// RequestIDHeader ...
const RequestIDHeader = "X-Request-Id"

// RequestIDHandler ...
func RequestIDHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id := r.Header.Get(RequestIDHeader)
			if id == "" {
				id = uuid.New().String()
			}
			w.Header().Set(RequestIDHeader, id)
			next.ServeHTTP(w, r)
		})
	}
}

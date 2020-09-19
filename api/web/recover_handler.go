package web

import (
	"log"
	"net/http"
	"runtime/debug"
)

// RecoverHandler ...
func RecoverHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil && err != http.ErrAbortHandler {
					log.Printf("Recover from %v: %s", err, debug.Stack())
					w.WriteHeader(http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

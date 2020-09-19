package web

import (
	"net/http"
	"regexp"
	"strings"
)

var (
	forwardedExpr = regexp.MustCompile(`(?i)(?:for=)([^(;|,| )]+)`)
)

// RemoteAddrHandler ...
func RemoteAddrHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if value := r.Header.Get("X-Forwarded-For"); value != "" {
				s := strings.Index(value, ", ")
				if s == -1 {
					s = len(value)
				}
				r.RemoteAddr = value[:s]
			} else if value := r.Header.Get("X-Real-IP"); value != "" {
				r.RemoteAddr = value
			} else if value := r.Header.Get("Forwarded"); value != "" {
				if match := forwardedExpr.FindStringSubmatch(value); len(match) > 1 {
					r.RemoteAddr = strings.Trim(match[1], `"`)
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

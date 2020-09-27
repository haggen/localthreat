package web

import (
	"net/http"
	"time"

	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
)

// RateLimiterHandler ...
func RateLimiterHandler() Middleware {
	lmt := tollbooth.NewLimiter(10, &limiter.ExpirableOptions{DefaultExpirationTTL: time.Hour})

	lmt.SetMessage("")
	lmt.SetMessageContentType("application/json; charset=utf-8")

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			httpErr := tollbooth.LimitByRequest(lmt, w, r)
			if httpErr != nil {
				w.Header().Add("Content-Type", lmt.GetMessageContentType())
				w.WriteHeader(httpErr.StatusCode)
				w.Write([]byte(httpErr.Message))
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

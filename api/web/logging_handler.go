package web

import (
	"log"
	"net/http"
	"time"
)

type buffResponseWriter struct {
	http.ResponseWriter
	status int
	buffer []byte
}

func (w *buffResponseWriter) WriteHeader(status int) {
	w.status = status
}

func (w *buffResponseWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = 200
	}
	w.buffer = append(w.buffer, b...)
	return len(b), nil
}

func (w *buffResponseWriter) Flush() error {
	if w.status == 0 {
		w.status = 200
	}
	w.ResponseWriter.WriteHeader(w.status)
	_, err := w.ResponseWriter.Write(w.buffer)
	return err
}

// LoggingHandler ...
func LoggingHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			b := &buffResponseWriter{w, 0, []byte{}}
			t := time.Now()

			next.ServeHTTP(b, r)
			b.Flush()

			log.Println(r.Method, r.URL.Path, r.Form.Encode(), b.status, len(b.buffer), r.RemoteAddr, time.Since(t))
		})
	}
}

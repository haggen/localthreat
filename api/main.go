package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/haggen/localthreat/api/web"
	gonanoid "github.com/matoous/go-nanoid"

	"github.com/jackc/pgx/v4"
)

// Route ...
type Route struct {
	Prefix string
	Target string
	Method string
}

// Parse ...
func (r *Route) Parse(req *http.Request) {
	r.Method = req.Method
	r.Prefix, r.Target = path.Split(req.URL.Path)
}

// Match ...
func (r *Route) Match(method string, pattern string) bool {
	if method != r.Method {
		return false
	}
	matched, _ := path.Match(pattern, r.Prefix+r.Target)
	return matched
}

func v1APIHandler(db *pgx.Conn) web.Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !strings.HasPrefix(r.URL.Path, "/v1/") {
				next.ServeHTTP(w, r)
				return
			}

			if err := r.ParseForm(); err != nil {
				log.Print("ParseForm():", err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			w.Header().Set("Content-Type", "application/json; charset=utf-8")

			route := &Route{}
			route.Parse(r)

			switch {
			case route.Match("POST", "/v1/reports"):
				src, err := ioutil.ReadAll(r.Body)
				if err != nil {
					panic(err)
				}
				id, err := gonanoid.Nanoid(10)
				if err != nil {
					panic(err)
				}
				report := &Report{
					ID: id,
				}
				report.Parse(string(src))
				data, err := json.Marshal(report)
				if err != nil {
					panic(err)
				}
				_, err = db.Exec(context.Background(), `INSERT INTO reports VALUES ($1, $2);`, report.ID, report.Data)
				if err != nil {
					panic(err)
				}
				w.Write(data)
				w.WriteHeader(http.StatusCreated)
			case route.Match("GET", "/v1/reports/*"):
				report := &Report{}
				err := db.QueryRow(context.Background(), `SELECT id, time, data FROM reports WHERE id = $1;`, route.Target).Scan(&report.ID, &report.Time, &report.Data)
				if err == pgx.ErrNoRows {
					w.WriteHeader(http.StatusNotFound)
					return
				} else if err != nil {
					panic(err)
				}
				data, err := json.Marshal(report)
				if err != nil {
					panic(err)
				}
				w.Write(data)
				w.WriteHeader(http.StatusOK)
			case route.Match("PATCH", "/v1/reports/*"):
				report := &Report{}
				err := db.QueryRow(context.Background(), `SELECT id, time, data FROM reports WHERE id = $1;`, route.Target).Scan(&report.ID, &report.Time, &report.Data)
				if err == pgx.ErrNoRows {
					w.WriteHeader(http.StatusNotFound)
					return
				} else if err != nil {
					panic(err)
				}
				src, err := ioutil.ReadAll(r.Body)
				if err != nil {
					panic(err)
				}
				report.Parse(string(src))
				_, err = db.Exec(context.Background(), `UPDATE reports SET data = $2 WHERE id = $1;`, report.ID, report.Data)
				if err != nil {
					panic(err)
				}
				data, err := json.Marshal(report)
				if err != nil {
					panic(err)
				}
				w.Write(data)
				w.WriteHeader(http.StatusOK)
			default:
				w.WriteHeader(http.StatusNotFound)
			}
		})
	}
}

func main() {
	database, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close(context.Background())

	w := web.New()

	w.Use(web.RecoverHandler())
	w.Use(web.RequestIDHandler())
	w.Use(web.LoggingHandler())
	w.Use(web.RemoteAddrHandler())
	w.Use(web.RateLimiterHandler())
	w.Use(web.CORSHandler())
	w.Use(v1APIHandler(database))

	w.Listen(":" + os.Getenv("PORT"))
}

package main

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/haggen/localthreat/api/web"
	gonanoid "github.com/matoous/go-nanoid"

	_ "github.com/mattn/go-sqlite3"
)

func v1APIHandler(db *sql.DB) web.Middleware {
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

			route := &web.Route{}
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
					ID:        id,
					CreatedAt: time.Now().UTC().Format(time.RFC3339),
					Source:    string(src),
				}
				report.Parse()
				_, err = db.Exec(`INSERT INTO reports (id, createdAt, source) VALUES (?, ?, ?);`, report.ID, report.CreatedAt, report.String())
				if err != nil {
					panic(err)
				}
				body, err := json.Marshal(report)
				if err != nil {
					panic(err)
				}
				w.WriteHeader(http.StatusCreated)
				w.Write(body)
			case route.Match("GET", "/v1/reports/*"):
				report := &Report{}
				err := db.QueryRow(`SELECT id, createdAt, source FROM reports WHERE id = ?;`, route.Target).Scan(&report.ID, &report.CreatedAt, &report.Source)
				if err == sql.ErrNoRows {
					w.WriteHeader(http.StatusNotFound)
					return
				} else if err != nil {
					panic(err)
				}
				report.Parse()
				body, err := json.Marshal(report)
				if err != nil {
					panic(err)
				}
				w.WriteHeader(http.StatusOK)
				w.Write(body)
			case route.Match("PATCH", "/v1/reports/*"):
				src, err := ioutil.ReadAll(r.Body)
				if err != nil {
					panic(err)
				}
				report := &Report{
					Source: string(src),
				}
				report.Parse()
				err = db.QueryRow(`SELECT id, createdAt, source FROM reports WHERE id = ?;`, route.Target).Scan(&report.ID, &report.CreatedAt, &report.Source)
				if err == sql.ErrNoRows {
					w.WriteHeader(http.StatusNotFound)
					return
				} else if err != nil {
					panic(err)
				}
				report.Parse()
				_, err = db.Exec(`UPDATE reports SET source = ? WHERE id = ?;`, report.String(), report.ID)
				if err != nil {
					panic(err)
				}
				body, err := json.Marshal(report)
				if err != nil {
					panic(err)
				}
				w.Write(body)
				w.WriteHeader(http.StatusOK)
			default:
				w.WriteHeader(http.StatusNotFound)
			}
		})
	}
}

func main() {
	database, err := sql.Open("sqlite3", "./storage/database.sqlite")
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	schema, err := os.ReadFile("./schema.sql")
	if err != nil {
		log.Fatal(err)
	}
	_, err = database.Exec(string(schema))
	if err != nil {
		log.Fatal(err)
	}

	w := web.New()

	w.Use(web.RecoverHandler())
	w.Use(web.RequestIDHandler())
	w.Use(web.LoggingHandler())
	w.Use(web.RemoteAddrHandler())
	w.Use(web.RateLimiterHandler())
	w.Use(web.CORSHandler())
	w.Use(v1APIHandler(database))

	w.Listen(":5000")
}

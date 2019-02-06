package main

import (
	"database/sql"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/facebookgo/grace/gracehttp"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
	"github.com/lib/pq"
	hashids "github.com/speps/go-hashids"
)

// Report ...
type Report struct {
	Timestamp time.Time `json:"timestamp"`
	ID        string    `json:"id"`
	Data      []string  `json:"data"`
}

// AppendData ...
func (r *Report) AppendData(data []string) {
	existing := map[string]bool{}
	for _, entry := range r.Data {
		existing[entry] = true
	}
	for _, entry := range data {
		if entry == "" {
			continue
		}
		if ok := existing[entry]; !ok {
			r.Data = append(r.Data, entry)
		}
	}
}

var lineSep = regexp.MustCompile(`[\n\r]+`)
var linkPat = regexp.MustCompile(`<url=showinfo:13..\/\/.+?>(.+?)<\/url>`)

func tryParseTranscript(chat string) ([]string, error) {
	match := linkPat.FindAllStringSubmatch(chat, -1)
	if match == nil {
		return nil, errors.New("Not a transcript")
	}
	data := []string{}
	for _, m := range match {
		data = append(data, m[1])
	}
	return data, nil
}

func parseBody(body io.ReadCloser) ([]string, error) {
	raw, err := ioutil.ReadAll(body)
	if err != nil {
		return nil, err
	}
	trimmed := strings.TrimSpace(string(raw))
	data, err := tryParseTranscript(trimmed)
	if err != nil {
		data = lineSep.Split(trimmed, -1)
	}
	return data, nil
}

var db *sql.DB
var hd *hashids.HashID

func saveReport(r *Report) error {
	if r.ID == "" {
		var id int
		err := db.QueryRow(`insert into reports (timestamp, data) values ($1, $2) returning id;`, r.Timestamp, pq.Array(r.Data)).Scan(&id)
		if err != nil {
			return err
		}
		r.ID, err = hd.Encode([]int{id})
		if err != nil {
			return err
		}
	} else {
		id, err := hd.DecodeWithError(r.ID)
		if err != nil {
			return err
		}
		r.Timestamp = time.Now()
		_, err = db.Exec(`update reports set timestamp = $2, data = $3 where id = $1;`, id[0], r.Timestamp, pq.Array(r.Data))
		if err != nil {
			return err
		}
	}
	return nil
}

func findReport(hid string) (*Report, error) {
	r := &Report{
		ID: hid,
	}
	id := hd.Decode(hid)
	err := db.QueryRow(`select timestamp, data from reports where id = $1 limit 1;`, id[0]).Scan(&r.Timestamp, pq.Array(&r.Data))
	switch {
	case err == sql.ErrNoRows:
		return nil, nil
	case err != nil:
		return nil, err
	}
	return r, nil
}

func handleNewReport(c echo.Context) error {
	data, err := parseBody(c.Request().Body)
	if err != nil {
		panic(err)
	}
	report := &Report{
		Timestamp: time.Now(),
		ID:        "",
	}
	report.AppendData(data)
	err = saveReport(report)
	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusCreated, report)
	return nil
}

func handlePatchReport(c echo.Context) error {
	report, err := findReport(c.Param("id"))
	if err != nil {
		panic(err)
	}
	if report == nil {
		return echo.ErrNotFound
	}
	data, err := parseBody(c.Request().Body)
	if err != nil {
		panic(err)
	}
	report.AppendData(data)
	err = saveReport(report)
	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, report)
	return nil
}

func handleGetReport(c echo.Context) error {
	report, err := findReport(c.Param("id"))
	if err != nil {
		panic(err)
	}
	if report == nil {
		return echo.ErrNotFound
	}
	c.JSON(http.StatusOK, report)
	return nil
}

func main() {
	var err error
	data := hashids.NewData()
	data.Salt = "localthreat.next"
	data.MinLength = 5
	hd, err = hashids.NewWithData(data)
	if err != nil {
		log.Fatal(err)
	}

	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()
	e.Logger.SetLevel(log.INFO)

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())

	e.POST("/reports", handleNewReport)
	e.PUT("/reports/:id", handlePatchReport)
	e.GET("/reports/:id", handleGetReport)

	e.Server.Addr = ":8080"
	e.Logger.Fatal(gracehttp.Serve(e.Server))
}

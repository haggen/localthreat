package main

import (
	"context"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"time"

	_ "github.com/haggen/localthreat.next/api/esi"
	_ "github.com/haggen/localthreat.next/api/zkb"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
	hashids "github.com/speps/go-hashids"
)

// Entity ...
type Entity struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Entry ...
type Entry struct {
	Character   *Entity   `json:"character"`
	Corporation *Entity   `json:"corporation"`
	Alliance    *Entity   `json:"alliance"`
	Ships       []*Entity `json:"ships"`
	Threat      int       `json:"threat"`
	GangRatio   int       `json:"gangRatio"`
	Kills       int       `json:"kills"`
	Losses      int       `json:"losses"`
}

// Report ...
type Report struct {
	Timestamp time.Time `json:"timestamp"`
	HashID    string    `json:"hashId"`
	Entries   []*Entry  `json:"entries"`
}

// NewReport ...
func NewReport() *Report {
	report := &Report{
		Timestamp: time.Now(),
		Entries:   []*Entry{},
	}
	return report
}

// AddEntries ...
func (r *Report) AddEntries(characters []string) {
loop:
	for _, name := range characters {
		for _, entry := range r.Entries {
			if entry.Character.Name == name {
				continue loop
			}
		}
		r.Entries = append(r.Entries, &Entry{
			Character: &Entity{
				Name: name,
			},
		})
	}
}

var lineSep = regexp.MustCompile(`[\n\r]+`)
var chatPat = regexp.MustCompile(`<url=showinfo:13..\/\/.+?>(.+?)<\/url>`)

func tryParseChat(chat string) ([]string, error) {
	match := chatPat.FindAllStringSubmatch(chat, -1)
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
	var data []string
	data, err = tryParseChat(string(raw))
	if err != nil {
		data = lineSep.Split(string(raw), -1)
	}
	return data, nil
}

var database []*Report
var h *hashids.HashID

func handleNewReport(c echo.Context) error {
	characters, err := parseBody(c.Request().Body)
	if err != nil {
		return err
	}
	report := NewReport()
	report.HashID, err = h.Encode([]int{len(database)})
	if err != nil {
		return err
	}
	report.AddEntries(characters)
	database = append(database, report)
	c.JSON(http.StatusCreated, report)
	return nil
}

func handlePatchReport(c echo.Context) error {
	var report *Report
	for _, r := range database {
		if r.HashID == c.Param("id") {
			report = r
			break
		}
	}
	if report == nil {
		return echo.ErrNotFound
	}
	characters, err := parseBody(c.Request().Body)
	if err != nil {
		return err
	}
	report.AddEntries(characters)
	c.JSON(http.StatusOK, report)
	return nil
}

func handleGetReport(c echo.Context) error {
	var report *Report
	for _, r := range database {
		if r.HashID == c.Param("id") {
			report = r
			break
		}
	}
	if report == nil {
		return echo.ErrNotFound
	}
	c.JSON(http.StatusOK, report)
	return nil
}

func main() {
	hd := hashids.NewData()
	hd.Salt = "localthreat.next"
	hd.MinLength = 5
	h, _ = hashids.NewWithData(hd)

	e := echo.New()
	e.Logger.SetLevel(log.INFO)

	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(middleware.Logger())

	e.POST("/reports", handleNewReport)
	e.PUT("/reports/:id", handlePatchReport)
	e.GET("/reports/:id", handleGetReport)

	go func() {
		if err := e.Start(":8080"); err != nil {
			e.Logger.Info("Gracefully shutting down...")
		}
	}()
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}

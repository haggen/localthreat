package main

import (
	"errors"
	"regexp"
	"strings"
)

// Report ...
type Report struct {
	ID   string   `json:"id" db:"id"`
	Data []string `json:"data" db:"data"`
}

// Append ...
func (r *Report) Append(data []string) {
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

var separator = regexp.MustCompile(`[\n\r]+`)
var mention = regexp.MustCompile(`<url=showinfo:13..\/\/.+?>(.+?)<\/url>`)

func parseTranscript(trancript string) ([]string, error) {
	match := mention.FindAllStringSubmatch(trancript, -1)
	if match == nil {
		return nil, errors.New("parseTranscript: no matches")
	}
	data := []string{}
	for _, m := range match {
		data = append(data, m[1])
	}
	return data, nil
}

// Parse ...
func (r *Report) Parse(src string) {
	trimmed := strings.TrimSpace(string(src))
	data, err := parseTranscript(trimmed)
	if err != nil {
		data = separator.Split(trimmed, -1)
	}
	r.Append(data)
}

package main

import (
	"errors"
	"regexp"
	"strings"
)

// Report ...
type Report struct {
	ID        string   `json:"id"`
	CreatedAt string   `json:"time"` // Client expects `time` key.
	Content   []string `json:"data"` // Client still expects `data` key.
	Source    string   `json:"-"`
}

// Append ...
func (r *Report) Append(content []string) {
	existing := map[string]bool{}
	for _, entry := range r.Content {
		existing[entry] = true
	}
	for _, entry := range content {
		if entry == "" {
			continue
		}
		if ok := existing[entry]; !ok {
			r.Content = append(r.Content, entry)
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
	content := []string{}
	for _, m := range match {
		content = append(content, m[1])
	}
	return content, nil
}

// Parse parses the source string into content.
func (r *Report) Parse() {
	trimmed := strings.TrimSpace(r.Source)
	content, err := parseTranscript(trimmed)
	if err != nil {
		content = separator.Split(trimmed, -1)
	}
	r.Append(content)
	r.Source = ""
}

// String rebuilds the source by joining the content elements.
func (r *Report) String() string {
	return strings.Join(r.Content, "\n")
}

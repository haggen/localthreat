package main

import (
	"bytes"
	"io/ioutil"
	"testing"
)

var sampleChatTranscript = `Lorem ipsum dolor sit amet, <url=showinfo:1300//1234>Consectetur Adipiscing</url> elit, sed do eiusmod tempor <url=showinfo:1300//1234>Incididunt Ut Labore</url> et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse <url=showinfo:1300//1234>Cillum Dolore</url> eu fugiat nulla pariatur. Excepteur sint occaecat <url=showinfo:1300//1234>Cupidatat Non Proident</url>, sunt in culpa qui officia deserunt mollit anim id est laborum.`
var sampleChatMembers = "Consectetur Adipiscing\r\nIncididunt Ut Dolore\r\nCillum Dolore\r\nCupidatat Non Proident"

func TestTryParseTranscript(t *testing.T) {
	data, err := tryParseTranscript(sampleChatTranscript)
	if err != nil {
		t.Error("Failed to parse valid transcript")
	}
	if len(data) != 4 {
		t.Error("Wrong data collected")
	}
	if data[0] != "Consectetur Adipiscing" {
		t.Error("Wrong data collected")
	}
}

func TestParseBody(t *testing.T) {
	sampleReader := bytes.NewBufferString(sampleChatMembers)
	readerCloser := ioutil.NopCloser(sampleReader)
	data, err := parseBody(readerCloser)
	if err != nil {
		t.Error("Failed to parse valid body")
	}
	if len(data) != 4 {
		t.Error("Wrong data collected")
	}
	if data[0] != "Consectetur Adipiscing" {
		t.Error("Wrong data collected")
	}
}

func TestReportAppendData(t *testing.T) {
	r := &Report{
		Data: []string{"a", "b", "c"},
	}
	r.AppendData([]string{"b", "c", "d"})
	if len(r.Data) != 4 {
		t.Fatalf("len(r.Data) is %d, expected %d", len(r.Data), 4)
	}
	if r.Data[3] != "d" {
		t.Fatalf("r.Data[3] is %s, expected %s", r.Data[3], "d")
	}
}

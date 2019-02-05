package esi

import (
	"fmt"
	"testing"
)

var sampleEntity = &Entity{
	Category: "character",
	ID:       95036967,
	Name:     "Jason Chorant",
}

var sampleAffiliation = &Affiliation{
	CorporationID: 98326827,
	AllianceID:    99004116,
}

func TestFetchByID(t *testing.T) {
	e := Entities{}
	err := e.FetchByID([]int{sampleEntity.ID})
	if err != nil {
		t.FailNow()
	}
	if len(e) < 1 {
		t.FailNow()
	}
	if e[0].Category != sampleEntity.Category {
		t.FailNow()
	}
	if e[0].Name != sampleEntity.Name {
		t.FailNow()
	}
}

func TestFetchByName(t *testing.T) {
	e := Entities{}
	err := e.FetchByName([]string{sampleEntity.Name})
	if err != nil {
		t.Fatal(err)
	}
	if len(e) < 1 {
		t.Fatalf("length is %d, expected 1", len(e))
	}
	if e[0].Category != sampleEntity.Category {
		t.Fatalf("category is %s, expected %s", e[0].Category, sampleEntity.Category)
	}
	if e[0].ID != sampleEntity.ID {
		t.Fatalf("id is %d, expected %d", e[0].ID, sampleEntity.ID)
	}
}

func TestAffiliations(t *testing.T) {
	affiliations := Affiliations{}
	err := affiliations.Fetch([]int{sampleEntity.ID})
	if err != nil {
		t.FailNow()
	}
	fmt.Print(affiliations)
	if len(affiliations) < 1 {
		t.FailNow()
	}
	if affiliations[0].CorporationID != sampleAffiliation.CorporationID {
		t.FailNow()
	}
}

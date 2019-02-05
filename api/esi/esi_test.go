package esi

import (
	"fmt"
	"testing"
)

var sampleEntity = &Entity{
	ID:   95036967,
	Name: "Jason Chorant",
}

var sampleAffiliation = &Affiliation{
	CorporationID: 98326827,
	AllianceID:    99004116,
}

func TestIDs(t *testing.T) {
	ids := &IDs{}
	err := ids.Fetch([]string{sampleEntity.Name})
	if err != nil {
		t.FailNow()
	}
	if len(ids.Characters) < 1 {
		t.FailNow()
	}
	if ids.Characters[0].ID != sampleEntity.ID {
		t.FailNow()
	}
}

func TestNames(t *testing.T) {
	names := Names{}
	err := names.Fetch([]int{sampleEntity.ID})
	if err != nil {
		t.FailNow()
	}
	fmt.Print(names)
	if len(names) < 1 {
		t.FailNow()
	}
	if names[0].Name != sampleEntity.Name {
		t.FailNow()
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

package esi

import (
	"testing"
)

var sampleEntity = &Entity{
	Category: "character",
	ID:       95036967,
	Name:     "Jason Chorant",
}

var sampleAffiliation = &Affiliation{
	CharacterID:   95036967,
	CorporationID: 98326827,
	AllianceID:    99004116,
}

func TestEntitiesFetchByID(t *testing.T) {
	e := Entities{}
	err := e.FetchByID([]int{sampleEntity.ID})
	if err != nil {
		t.Fatal(err)
	}
	if len(e) != 1 {
		t.Fatalf("length is %d, expected 1", len(e))
	}
	if e[0].Category != sampleEntity.Category {
		t.Fatalf("category is %s, expected %s", e[0].Category, sampleEntity.Category)
	}
	if e[0].Name != sampleEntity.Name {
		t.Fatalf("name is %s, expected %s", e[0].Name, sampleEntity.Name)
	}
}

func TestEntitiesFetchByName(t *testing.T) {
	e := Entities{}
	err := e.FetchByName([]string{sampleEntity.Name})
	if err != nil {
		t.Fatal(err)
	}
	if len(e) < 1 {
		t.Fatalf("length is %d, expected at least 1", len(e))
	}
	if e[0].Category != sampleEntity.Category {
		t.Fatalf("category is %s, expected %s", e[0].Category, sampleEntity.Category)
	}
	if e[0].ID != sampleEntity.ID {
		t.Fatalf("id is %d, expected %d", e[0].ID, sampleEntity.ID)
	}
}

func TestAffiliationsFetchByID(t *testing.T) {
	a := Affiliations{}
	err := a.FetchByID([]int{sampleEntity.ID})
	if err != nil {
		t.Fatal(err)
	}
	if len(a) != 1 {
		t.Fatalf("length is %d, expected 1", len(a))
	}
	if a[0].CharacterID != sampleAffiliation.CharacterID {
		t.Fatalf("character id is %d, expected %d", a[0].CharacterID, sampleAffiliation.CharacterID)
	}
	if a[0].CorporationID != sampleAffiliation.CorporationID {
		t.Fatalf("corporation id is %d, expected %d", a[0].CorporationID, sampleAffiliation.CorporationID)
	}
	if a[0].AllianceID != sampleAffiliation.AllianceID {
		t.Fatalf("alliance id is %d, expected %d", a[0].AllianceID, sampleAffiliation.AllianceID)
	}
}

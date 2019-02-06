// Package esi is the Go implementation of a small subset of EVE's ESI API.
package esi

import (
	"errors"
	"net/http"

	resty "gopkg.in/resty.v1"
)

var endpoint = "https://esi.evetech.net/latest"

const (
	CategoryCharacter = "character"
)

// Entity ...
type Entity struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
}

// Entities ...
type Entities []*Entity

// FetchByID resolves a set of IDs to characters, corporations, allaiances, and more.
// https://esi.evetech.net/ui/#/Universe/post_universe_names
func (e *Entities) FetchByID(i []int) error {
	resp, err := resty.
		R().
		SetBody(i).
		SetResult(e).
		Post(endpoint + "/universe/names/")
	if err != nil {
		return err
	}
	if resp.StatusCode() != http.StatusOK {
		return errors.New("esi: " + resp.Status())
	}
	return nil
}

// FetchByName resolves a set of names to characters, corporations, allaiances, and more.
// https://esi.evetech.net/ui/#/Universe/post_universe_ids
func (e *Entities) FetchByName(n []string) error {
	data := map[string][]*Entity{}
	resp, err := resty.
		R().
		SetBody(n).
		SetResult(&data).
		Post(endpoint + "/universe/ids/")
	if err != nil {
		return err
	}
	if resp.StatusCode() != http.StatusOK {
		return errors.New("esi: " + resp.Status())
	}
	for category, entities := range data {
		for _, entity := range entities {
			switch category {
			case "characters":
				entity.Category = CategoryCharacter
			}
			*e = append(*e, entity)
		}
	}
	return nil
}

// Affiliation ...
type Affiliation struct {
	CharacterID   int `json:"character_id"`
	CorporationID int `json:"corporation_id"`
	AllianceID    int `json:"alliance_id"`
}

// Affiliations ...
type Affiliations []*Affiliation

// FetchByID resolves a set of character IDs to corporation, alliance and faction affiliations.
// https://esi.evetech.net/ui/#/Character/post_characters_affiliation
func (a *Affiliations) FetchByID(i []int) error {
	resp, err := resty.
		R().
		SetBody(i).
		SetResult(a).
		Post(endpoint + "/characters/affiliation/")
	if err != nil {
		return err
	}
	if resp.StatusCode() != http.StatusOK {
		return errors.New("esi: " + resp.Status())
	}
	return nil
}

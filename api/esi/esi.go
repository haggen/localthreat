// Package esi is the Go implementation of a small subset of EVE's ESI API.
package esi

import (
	"errors"
	"net/http"

	resty "gopkg.in/resty.v1"
)

var endpoint = "https://esi.evetech.net/latest"

// Affiliation ...
type Affiliation struct {
	CorporationID int `json:"corporation_id"`
	AllianceID    int `json:"alliance_id"`
}

// Affiliations ...
type Affiliations []*Affiliation

// Fetch resolves a set of character IDs to corporation, alliance and faction affiliations.
// https://esi.evetech.net/ui/#/Character/post_characters_affiliation
func (a *Affiliations) Fetch(ids []int) error {
	resp, err := resty.
		R().
		SetBody(ids).
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

// Entity ...
type Entity struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category,omitempty"`
}

// Names ...
type Names []*Entity

// Fetch resolves a set of IDs to names and categories.
// https://esi.evetech.net/ui/#/Universe/post_universe_names
func (n *Names) Fetch(ids []int) error {
	resp, err := resty.
		R().
		SetBody(ids).
		SetResult(n).
		Post(endpoint + "/universe/names/")
	if err != nil {
		return err
	}
	if resp.StatusCode() != http.StatusOK {
		return errors.New("esi: " + resp.Status())
	}
	return nil
}

// IDs ...
type IDs struct {
	Characters []*Entity `json:"characters"`
}

// Fetch resolves a set of names to IDs.
// https://esi.evetech.net/ui/#/Universe/post_universe_ids
func (i *IDs) Fetch(names []string) error {
	resp, err := resty.
		R().
		SetBody(names).
		SetResult(i).
		Post(endpoint + "/universe/ids/")
	if err != nil {
		return err
	}
	if resp.StatusCode() != http.StatusOK {
		return errors.New("esi: " + resp.Status())
	}
	return nil
}

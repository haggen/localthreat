package zkb

import (
	resty "gopkg.in/resty.v1"
)

// https://github.com/zKillboard/zKillboard/wiki/API-(Statistics)
// e.g. https://zkillboard.com/api/stats/characterID/1872100808/
func Stats(id string) (interface{}, error) {
	var stats interface{}
	_, err := resty.
		R().
		SetResult(&stats).
		Get("https://zkillboard.com/api/stats/characterID/" + id + "/")
	if err != nil {
		return nil, err
	}
	return stats, nil
}

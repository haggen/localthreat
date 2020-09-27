package web

import (
	"net/http"
	"path"
)

// Route ...
type Route struct {
	Prefix string
	Target string
	Method string
}

// Parse ...
func (r *Route) Parse(req *http.Request) {
	r.Method = req.Method
	r.Prefix, r.Target = path.Split(req.URL.Path)
}

// Match ...
func (r *Route) Match(method string, pattern string) bool {
	if method != r.Method {
		return false
	}
	matched, _ := path.Match(pattern, r.Prefix+r.Target)
	return matched
}

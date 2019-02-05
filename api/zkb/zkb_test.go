package zkb

import (
	"testing"
)

var sampleID = "1872100808"

func TestStats(t *testing.T) {
	_, err := Stats(sampleID)
	if err != nil {
		t.Error("Stats failed for a valid ID")
	}
}

package utils

import (
	"encoding/json"
)

// ToJSON marshals a struct into JSON without returning any errors (returns an empty
// json object if it errors. WARNING, panics for debug purposes.
func ToJSON(i interface{}) []byte {
	b, err := json.Marshal(i)
	if err != nil {
		return []byte("{}")
	}
	return b
}

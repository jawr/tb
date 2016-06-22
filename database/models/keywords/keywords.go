package keywords

import (
	"encoding/json"
	"github.com/jawr/tb/database/connection"
)

type Keyword struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Keywords []Keyword

func (j *Keywords) MarshalJSON() ([]byte, error) {
	if len(*j) == 0 {
		return json.Marshal([]string{})
	}
	return json.Marshal(*j)
}

func New(name string) (k Keyword, err error) {
	k.Name = name
	conn, err := connection.Get()
	if err != nil {
		return
	}
	err = conn.QueryRow("SELECT insert_keyword($1)", name).Scan(&k.ID)
	return
}

func (k *Keyword) Sync() (err error) {
	list, err := GetByID(k.ID)
	if len(list) == 1 {
		*k = list[0]
	}
	return
}

package locations

import (
	"encoding/json"
	"github.com/jawr/tb/database/connection"
)

type Location struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Point   Point  `json:"point"`
	Address string `json:"address"`
}

type Locations []Location

func (j *Locations) MarshalJSON() ([]byte, error) {
	if len(*j) == 0 {
		return json.Marshal([]string{})
	}
	return json.Marshal(*j)
}

func New(name string, lat, lng float64) (l Location, err error) {
	l.Name = name
	l.Point = NewPoint(lat, lng)
	conn, err := connection.Get()
	if err != nil {
		return
	}
	err = conn.QueryRow("SELECT insert_location($1, $2)", name, l.Point).Scan(&l.ID)
	return
}

func (l Location) Save() (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	_, err = conn.Exec(
		"UPDATE location SET name = $1, address = $2 WHERE id = $3",
		l.Name,
		l.Address,
		l.ID,
	)
	return
}

func (l *Location) Sync() (err error) {
	list, err := GetByID(l.ID)
	if len(list) == 1 {
		*l = list[0]
	}
	return
}

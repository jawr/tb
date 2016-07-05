package locations

import (
	"encoding/json"
	"github.com/jawr/tb/database/connection"
	"github.com/jawr/tb/database/models/approved"
	"github.com/jawr/tb/database/utils"
	"time"
)

type Meta struct {
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	Postcode string `json:"postcode"`
}

type Location struct {
	ID           int           `json:"id"`
	Name         string        `json:"name"`
	Point        Point         `json:"point"`
	Meta         Meta          `json:"meta"`
	AddedAt      time.Time     `json:"added_at"`
	Approved     bool          `json:"approved"`
	ApprovedMeta approved.Meta `json:"approved_meta"`
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
		"UPDATE location SET name = $1, meta = $2 WHERE id = $3",
		l.Name,
		utils.ToJSON(l.Meta),
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

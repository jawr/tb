package activities

import (
	"github.com/jawr/tb/database/connection"
	"github.com/jawr/tb/database/models/categories"
	"github.com/jawr/tb/database/models/keywords"
	"github.com/jawr/tb/database/models/locations"
)

type Activity struct {
	ID        int                 `json:"id"`
	Name      string              `json:"name"`
	Slug      string              `json:"slug"`
	Category  categories.Category `json:"category"`
	Keywords  keywords.Keywords   `json:"keywords"`
	Locations locations.Locations `json:"locations"`
}

func New(name string, cat categories.Category) (a Activity, err error) {
	a.Name = name
	a.Category = cat
	conn, err := connection.Get()
	if err != nil {
		return
	}
	err = conn.QueryRow("SELECT insert_activity($1, $2)", name, cat.ID).Scan(&a.ID)
	return
}

func (a Activity) Save() (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	_, err = conn.Exec("UPDATE activity SET slug = $1 WHERE id = $2", a.Slug, a.ID)
	return
}

func (a *Activity) Sync() (err error) {
	list, err := GetByID(a.ID)
	if len(list) == 1 {
		*a = list[0]
	}
	a.Keywords, err = keywords.GetByActivityID(a.ID)
	if err != nil {
		return
	}
	a.Locations, err = locations.GetByActivityID(a.ID)
	return
}

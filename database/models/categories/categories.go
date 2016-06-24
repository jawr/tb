package categories

import (
	"github.com/jawr/tb/database/connection"
)

type Category struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Alive bool   `json:"alive"`
}

func New(name string) (c Category, err error) {
	c.Name = name
	conn, err := connection.Get()
	if err != nil {
		return
	}
	err = conn.QueryRow("SELECT insert_category($1)", name).Scan(&c.ID)
	return
}

func Delete(id int) (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	_, err = conn.Exec("UPDATE category SET alive = false WHERE id = $1", id)
	return
}

func (c *Category) Sync() (err error) {
	list, err := GetByID(c.ID)
	if len(list) == 1 {
		*c = list[0]
	}
	return
}

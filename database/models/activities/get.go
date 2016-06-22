package activities

import (
	"github.com/jawr/tb/database/connection"
	"github.com/jawr/tb/database/models/keywords"
	"github.com/jawr/tb/database/models/locations"
)

const (
	SELECT string = "SELECT * FROM activity "
)

func GetAll() ([]Activity, error) {
	return GetList(SELECT)
}

func GetByID(id int) ([]Activity, error) {
	return GetList(SELECT+" WHERE id = $1", id)
}

func parseRow(row connection.Row) (a Activity, err error) {
	err = row.Scan(&a.ID, &a.Name, &a.Slug, &a.Category.ID)
	if err != nil {
		return
	}
	err = a.Category.Sync()
	a.Keywords, err = keywords.GetByActivityID(a.ID)
	if err != nil {
		return
	}
	a.Locations, err = locations.GetByActivityID(a.ID)
	return
}

func GetList(query string, args ...interface{}) (res []Activity, err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	rows, err := conn.Query(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		rt, err := parseRow(rows)
		if err != nil {
			return res, err
		}
		res = append(res, rt)
	}
	return res, rows.Err()
}

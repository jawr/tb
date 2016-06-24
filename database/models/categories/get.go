package categories

import (
	"github.com/jawr/tb/database/connection"
)

const (
	SELECT       string = "SELECT * FROM category "
	SELECT_ALIVE string = SELECT + " WHERE alive = true "
)

func GetAll() ([]Category, error) {
	return GetList(SELECT_ALIVE)
}

func GetByID(id int) ([]Category, error) {
	return GetList(SELECT+" WHERE id = $1", id)
}

func parseRow(row connection.Row) (c Category, err error) {
	err = row.Scan(&c.ID, &c.Name, &c.Alive)
	return
}

func GetList(query string, args ...interface{}) (res []Category, err error) {
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

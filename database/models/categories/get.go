package categories

import (
	"github.com/jawr/tb/database/connection"
)

const (
	SELECT string = "SELECT * FROM category "
)

func GetAll() ([]Category, error) {
	return GetList(SELECT)
}

func GetByID(id int) ([]Category, error) {
	return GetList(SELECT+" WHERE id = $1", id)
}

func parseRow(row connection.Row) (c Category, err error) {
	err = row.Scan(&c.ID, &c.Name)
	return
}

func GetList(query string, args ...interface{}) (res []Category, err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	rows, err := conn.Query(query, args...)
	defer rows.Close()
	if err != nil {
		return
	}
	for rows.Next() {
		rt, err := parseRow(rows)
		if err != nil {
			return res, err
		}
		res = append(res, rt)
	}
	return res, rows.Err()
}

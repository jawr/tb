package keywords

import (
	"github.com/jawr/tb/database/connection"
)

const (
	SELECT string = "SELECT * FROM keyword "
)

func GetByID(id int) ([]Keyword, error) {
	return GetList(SELECT+" WHERE id = $1", id)
}

func GetByActivityID(id int) ([]Keyword, error) {
	return GetList("SELECT k.* FROM keyword k JOIN activity_keywords a ON a.keyword_id = k.id WHERE a.activity_id = $1", id)
}

func parseRow(row connection.Row) (k Keyword, err error) {
	err = row.Scan(&k.ID, &k.Name)
	return
}

func GetList(query string, args ...interface{}) (res []Keyword, err error) {
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

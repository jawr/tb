package categories

import (
	"encoding/json"
	"fmt"
	"github.com/jawr/tb/database/connection"
)

const (
	SELECT      string = "SELECT c.*, count(a.id) FROM category c LEFT JOIN activity a ON c.id = a.category_id %s GROUP BY c.id"
	WHERE_ALIVE string = "WHERE c.alive = true"
	WHERE_ID    string = "WHERE c.id = $1"
)

func GetAll() ([]Category, error) {
	return GetList(fmt.Sprintf(SELECT, WHERE_ALIVE))
}

func GetByID(id int) ([]Category, error) {
	return GetList(fmt.Sprintf(SELECT, WHERE_ID), id)
}

func parseRow(row connection.Row) (c Category, err error) {
	var approvedMeta []byte
	err = row.Scan(
		&c.ID,
		&c.Name,
		&c.Alive,
		&c.AddedAt,
		&c.Approved,
		&approvedMeta,
		&c.ActivityCount,
	)
	if err != nil {
		return
	}
	err = json.Unmarshal(approvedMeta, &c.ApprovedMeta)
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

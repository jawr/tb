package activities

import (
	"encoding/json"
	"github.com/jawr/tb/database/connection"
	"github.com/jawr/tb/database/models/keywords"
	"github.com/jawr/tb/database/models/locations"
)

const (
	SELECT       string = "SELECT * FROM activity "
	SELECT_ALIVE string = SELECT + "WHERE alive = true "
)

func GetAll() ([]Activity, error) {
	return GetList(SELECT_ALIVE)
}

func GetByID(id int) ([]Activity, error) {
	return GetList(SELECT+" WHERE id = $1", id)
}

func GetByCategoryID(id int) ([]Activity, error) {
	return GetList(SELECT_ALIVE+" AND category_id = $1", id)
}

func parseRow(row connection.Row) (a Activity, err error) {
	var approvedMeta []byte
	err = row.Scan(
		&a.ID,
		&a.Name,
		&a.Slug,
		&a.Category.ID,
		&a.Alive,
		&a.AddedAt,
		&a.Approved,
		&approvedMeta,
	)
	if err != nil {
		return
	}
	err = json.Unmarshal(approvedMeta, &a.ApprovedMeta)
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
	if rows.Err() != nil {
		return res, rows.Err()
	}
	for idx, _ := range res {
		a := &res[idx]
		err = a.Category.Sync()
		a.Keywords, err = keywords.GetByActivityID(a.ID)
		if err != nil {
			return res, err
		}
		a.Locations, err = locations.GetByActivityID(a.ID)
		if err != nil {
			return res, err
		}
	}
	return res, nil
}

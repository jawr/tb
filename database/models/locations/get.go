package locations

import (
	"github.com/jawr/tb/database/connection"
)

const (
	SELECT string = "SELECT * FROM location "
)

func GetAll() ([]Location, error) {
	return GetList(SELECT)
}

func GetByID(id int) ([]Location, error) {
	return GetList(SELECT+" WHERE id = $1", id)
}

func GetByPointRadiusM(p Point, m int) ([]Location, error) {
	return GetList(SELECT+" WHERE point != $1 AND ST_DWithin(point, $2, $3)", p, p, m)
}

func GetByActivityID(id int) ([]Location, error) {
	return GetList("SELECT k.* FROM location k JOIN activity_locations a ON a.location_id = k.id WHERE a.activity_id = $1", id)
}

func parseRow(row connection.Row) (l Location, err error) {
	err = row.Scan(&l.ID, &l.Name, &l.Point)
	return
}

func GetList(query string, args ...interface{}) (res []Location, err error) {
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

package activities

import (
	"github.com/jawr/tb/database/connection"
	"github.com/jawr/tb/database/models/locations"
)

func (a *Activity) AddLocation(l locations.Location) (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	conn.Exec("INSERT INTO activity_locations (activity_id, location_id) VALUES ($1, $2)",
		a.ID,
		l.ID,
	)
	for _, i := range a.Locations {
		if i.ID == l.ID {
			return
		}
	}
	a.Locations = append(a.Locations, l)
	return
}

func (a *Activity) DelLocation(l locations.Location) (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	_, err = conn.Exec("DELETE FROM activity_locations WHERE activity_id = $1 AND location_id = $2",
		a.ID,
		l.ID,
	)
	for idx, i := range a.Locations {
		if i.ID == l.ID {
			a.Locations = append(a.Locations[:idx], a.Locations[idx+1:]...)
			return
		}
	}
	return
}

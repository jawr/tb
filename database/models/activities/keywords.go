package activities

import (
	"github.com/jawr/tb/database/connection"
	"github.com/jawr/tb/database/models/keywords"
)

func (a *Activity) AddKeyword(k keywords.Keyword) (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	conn.Exec("INSERT INTO activity_keywords (activity_id, keyword_id) VALUES ($1, $2)",
		a.ID,
		k.ID,
	)
	for _, i := range a.Keywords {
		if i.ID == k.ID {
			return
		}
	}
	a.Keywords = append(a.Keywords, k)
	return
}

func (a *Activity) DelKeyword(k keywords.Keyword) (err error) {
	conn, err := connection.Get()
	if err != nil {
		return
	}
	_, err = conn.Exec("DELETE FROM activity_keywords WHERE activity_id = $1 AND keyword_id = $2",
		a.ID,
		k.ID,
	)
	for idx, i := range a.Keywords {
		if i.ID == k.ID {
			a.Keywords = append(a.Keywords[:idx], a.Keywords[idx+1:]...)
			return
		}
	}
	return
}

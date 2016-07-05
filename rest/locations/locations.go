package locations

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jawr/dns/rest/paginator"
	"github.com/jawr/dns/rest/util"
	"github.com/jawr/tb/database/models/activities"
	db "github.com/jawr/tb/database/models/locations"
	"github.com/jawr/tb/external/mapquest"
	"net/http"
	"net/url"
)

var routes = util.Routes{
	util.Route{
		"Index",
		"GET",
		"/",
		paginator.Paginate(Search),
	},
	util.Route{
		"Insert",
		"POST",
		"/",
		Insert,
	},
	util.Route{
		"ByID",
		"GET",
		"/{id}",
		ByID(serve),
	},
	util.Route{
		"Find",
		"POST",
		"/find",
		Find,
	},
}

func Setup(router *mux.Router) {
	subRouter := router.PathPrefix("/locations").Subrouter()
	util.SetupRouter(subRouter, "Location", routes)
}

func Search(w http.ResponseWriter, r *http.Request, params url.Values, limit, offset int) {
	res, err := db.GetAll()
	util.ToJSON(res, err, w)
}

type insertJSON struct {
	Location db.Location         `json:"location"`
	Activity activities.Activity `json:"activity"`
}

func Insert(w http.ResponseWriter, r *http.Request) {
	var data insertJSON
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		util.Error(err, w)
		return
	}

	location, err := db.New(
		data.Location.Name,
		data.Location.Point.Lat,
		data.Location.Point.Lng,
	)
	if err != nil {
		util.Error(err, w)
		return
	}

	location.Meta = data.Location.Meta

	if len(location.Meta.Postcode) == 0 {
		address, postcode, err := mapquest.AddressFromPoint(location.Point)
		if err == nil {
			location.Meta.Address = address
			location.Meta.Postcode = postcode
		}
	}

	err = location.Save()
	if err != nil {
		util.Error(err, w)
		return
	}

	// do we need to sync?
	err = data.Activity.AddLocation(location)

	util.ToJSON(location, err, w)
}

type FindJSON struct {
	Address  string `json:"address"`
	Postcode string `json:"postcode"`
}

func Find(w http.ResponseWriter, r *http.Request) {
	// decode post
	decoder := json.NewDecoder(r.Body)
	var data FindJSON
	err := decoder.Decode(&data)
	if err != nil {
		util.Error(err, w)
		return
	}

	point, err := mapquest.PointFromAddress(data.Address, data.Postcode)
	util.ToJSON(point, err, w)
}

func ByID(fn func(http.ResponseWriter, *http.Request, []db.Location)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		res, err := db.GetByID(util.ParseInt(vars["id"]))
		if err != nil {
			util.Error(err, w)
			return
		}
		fn(w, r, res)
	}
}

func serve(w http.ResponseWriter, r *http.Request, res []db.Location) {
	util.ToJSON(res, nil, w)
}

package locations

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jawr/dns/rest/paginator"
	"github.com/jawr/dns/rest/util"
	"github.com/jawr/tb/database/models/activities"
	db "github.com/jawr/tb/database/models/locations"
	"net/http"
	"net/url"
	"strings"
)

var routes = util.Routes{
	util.Route{
		"Index",
		"GET",
		"/",
		paginator.Paginate(Search),
	},
	util.Route{
		"ByID",
		"GET",
		"/{id}",
		ByID(serve),
	},
	util.Route{
		"FindAndAdd",
		"POST",
		"/find-and-add",
		FindAndAdd,
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

type FindAndAddJSON struct {
	Postcode string              `json:"postcode"`
	Activity activities.Activity `json:"activity"`
}

type PostcodesJSON struct {
	Postcode  string  `json:"postcode"`
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
}

type PostcodesResponseJSON struct {
	Result PostcodesJSON `json:"result"`
}

func FindAndAdd(w http.ResponseWriter, r *http.Request) {
	// decode post
	decoder := json.NewDecoder(r.Body)
	var data FindAndAddJSON
	err := decoder.Decode(&data)
	if err != nil {
		util.Error(err, w)
		return
	}
	// normalise postcode
	postcode := strings.Replace(data.Postcode, " ", "", -1)
	// get from postcodes.io
	response, err := http.Get(fmt.Sprintf("http://api.postcodes.io/postcodes/%s", postcode))
	if err != nil {
		util.Error(err, w)
		return
	}
	// decode response
	defer response.Body.Close()
	decoder = json.NewDecoder(response.Body)
	var postcodeData PostcodesResponseJSON
	err = decoder.Decode(&postcodeData)
	if err != nil {
		util.Error(err, w)
		return
	}
	// create location
	location, err := db.New(data.Postcode, postcodeData.Result.Latitude, postcodeData.Result.Longitude)
	if err != nil {
		util.Error(err, w)
		return
	}

	// add location to activity in data
	err = data.Activity.AddLocation(location)
	if err != nil {
		util.Error(err, w)
		return
	}

	util.ToJSON(location, nil, w)
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

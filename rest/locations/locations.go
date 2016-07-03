package locations

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jawr/dns/rest/paginator"
	"github.com/jawr/dns/rest/util"
	db "github.com/jawr/tb/database/models/locations"
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

type FindJSON struct {
	Address  string `json:"address"`
	Postcode string `json:"postcode"`
}

type mapQuestLocationJSON struct {
	Point db.Point `json:"latLng"`
}

type mapQuestResultJSON struct {
	Locations []mapQuestLocationJSON `json:"locations"`
}

type mapQuestResponseJSON struct {
	Results []mapQuestResultJSON `json:"results"`
}

func Find(w http.ResponseWriter, r *http.Request) {
	// decode post
	decoder := json.NewDecoder(r.Body)
	var data FindJSON
	err := decoder.Decode(&data)
	if err != nil {
		fmt.Println("Cant decode post")
		util.Error(err, w)
		return
	}
	// normalise address
	address := url.QueryEscape(data.Address)
	postcode := url.QueryEscape(data.Postcode)
	// get from mapquest
	url := fmt.Sprintf("http://www.mapquestapi.com/geocoding/v1/address?key=6WGIEYoKFmaUVYAVl0MUheK0dMyN1HW1&outFormat=json&postalCode=%s&areaAdmin1=GB&street=%s", postcode, address)
	response, err := http.Get(url)
	if err != nil {
		fmt.Println("Can not get mapquest")
		util.Error(err, w)
		return
	}
	// decode response
	defer response.Body.Close()
	decoder = json.NewDecoder(response.Body)

	var responseData mapQuestResponseJSON
	err = decoder.Decode(&responseData)
	if err != nil {
		fmt.Println("Can not decode mapquest")
		util.Error(err, w)
		return
	}

	if len(responseData.Results) == 0 || len(responseData.Results[0].Locations) == 0 {
		fmt.Println("Not enough results")
		util.Error(errors.New("Unable to find any results"), w)
		return
	}

	util.ToJSON(responseData.Results[0].Locations[0].Point, nil, w)
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

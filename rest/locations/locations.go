package locations

import (
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
		"/{id}/",
		ByID(serve),
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

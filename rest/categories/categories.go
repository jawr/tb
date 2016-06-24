package categories

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jawr/dns/rest/paginator"
	"github.com/jawr/dns/rest/util"
	db "github.com/jawr/tb/database/models/categories"
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
	util.Route{
		"Insert",
		"POST",
		"/",
		Insert,
	},
	util.Route{
		"Delete",
		"DELETE",
		"/{id}",
		Delete,
	},
}

func Setup(router *mux.Router) {
	subRouter := router.PathPrefix("/categories").Subrouter()
	util.SetupRouter(subRouter, "Category", routes)
}

func Search(w http.ResponseWriter, r *http.Request, params url.Values, limit, offset int) {
	res, err := db.GetAll()
	util.ToJSON(res, err, w)
}

func Insert(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data db.Category
	err := decoder.Decode(&data)
	if err != nil {
		util.Error(err, w)
		return
	}
	obj, err := db.New(data.Name)
	util.ToJSON(obj, err, w)
}

func Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	err := db.Delete(util.ParseInt(vars["id"]))
	if err != nil {
		util.Error(err, w)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func ByID(fn func(http.ResponseWriter, *http.Request, []db.Category)) http.HandlerFunc {
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

func serve(w http.ResponseWriter, r *http.Request, res []db.Category) {
	util.ToJSON(res, nil, w)
}

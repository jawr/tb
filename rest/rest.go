package rest

import (
	"github.com/gorilla/mux"
	"github.com/jawr/tb/rest/activities"
	"github.com/jawr/tb/rest/categories"
	"github.com/jawr/tb/rest/locations"
	"log"
	"net/http"
)

func Start() error {
	r := mux.NewRouter()
	sr := r.PathPrefix("/api/v1").Subrouter()
	categories.Setup(sr)
	activities.Setup(sr)
	locations.Setup(sr)
	log.Println("Starting rest service...")
	err := http.ListenAndServe("127.0.0.1:8090", r)
	log.Println("Stoping rest service...")
	return err
}

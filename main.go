package main

import (
	"github.com/jawr/tb/database/models/activities"
	"github.com/jawr/tb/database/models/categories"
	"github.com/jawr/tb/database/models/keywords"
	"github.com/jawr/tb/database/models/locations"
	"github.com/jawr/tb/rest"
	"log"
)

func main() {
	log.Println("Starting training buddy")
	testDatabaseModels()
	err := rest.Start()
	if err != nil {
		log.Fatal(err)
	}
}

func testDatabaseModels() {
	log.Println("Create category 'swimming'")
	c1, err := categories.New("swimming")
	if err != nil {
		log.Fatal(err)
	}
	_, err = categories.New("swimming")
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Create activity 'swimming/100m'")
	a1, err := activities.New("100m", c1)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", a1)
	a2 := activities.Activity{
		ID: 1,
	}
	err = a2.Sync()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", a2)
	log.Printf("Create keyword 'cardio'")
	k1, err := keywords.New("cardio")
	if err != nil {
		log.Fatal(err)
	}
	err = a2.AddKeyword(k1)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Create keyword 'water'")
	k2, err := keywords.New("water")
	if err != nil {
		log.Fatal(err)
	}
	err = a2.AddKeyword(k2)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", a2)
	err = a2.DelKeyword(k2)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", a2)
	err = a2.AddKeyword(k2)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", a2)
	log.Println("Create location 'n43dp', '51.569061 0.117689')")
	l1, err := locations.New("n43dp", 51.569061, 0.117689)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", l1)
	log.Println("Create location 'n44dl', '51.572382 -0.111187')")
	l2, err := locations.New("n44dl", 51.572382, -0.111187)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", l2)
	log.Println("Search l1 for distance of 100m")
	res, err := locations.GetByPointRadiusM(l1.Point, 100)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", res)

	err = a2.AddLocation(l1)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%+v\n", a2)
}

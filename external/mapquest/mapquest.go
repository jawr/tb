package mapquest

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/jawr/tb/database/models/locations"
	"net/http"
	"net/url"
)

const (
	URL string = "http://www.mapquestapi.com/geocoding/v1/"
	KEY string = "6WGIEYoKFmaUVYAVl0MUheK0dMyN1HW1"
)

type mapQuestLocationJSON struct {
	Point    locations.Point `json:"latLng"`
	Street   string          `json:"street"`
	City     string          `json:"adminArea5"`
	Postcode string          `json:"postalCode"`
}

type mapQuestResultJSON struct {
	Locations []mapQuestLocationJSON `json:"locations"`
}

type mapQuestResponseJSON struct {
	Results []mapQuestResultJSON `json:"results"`
}

func PointFromAddress(address, postcode string) (point locations.Point, err error) {
	// normalise address
	address = url.QueryEscape(address)
	postcode = url.QueryEscape(postcode)
	// get from mapquest
	url := fmt.Sprintf(
		"%saddress?key=%s&outFormat=json&postalCode=%s&areaAdmin1=GB&street=%s",
		URL,
		KEY,
		postcode,
		address,
	)
	response, err := http.Get(url)
	if err != nil {
		return
	}

	// decode response
	defer response.Body.Close()
	decoder := json.NewDecoder(response.Body)

	var responseData mapQuestResponseJSON
	err = decoder.Decode(&responseData)
	if err != nil {
		return
	}

	if len(responseData.Results) == 0 || len(responseData.Results[0].Locations) == 0 {
		err = errors.New("Unable to find any results")
		return point, err
	}

	point = responseData.Results[0].Locations[0].Point
	return
}

func AddressFromPoint(point locations.Point) (address, postcode string, err error) {
	url := fmt.Sprintf(
		"%saddress?key=%s&outFormat=json&location=%f,%f",
		URL,
		KEY,
		point.Lat,
		point.Lng,
	)
	fmt.Println(url)
	response, err := http.Get(url)
	if err != nil {
		return
	}

	// decode response
	defer response.Body.Close()
	decoder := json.NewDecoder(response.Body)

	var responseData mapQuestResponseJSON
	err = decoder.Decode(&responseData)
	if err != nil {
		return
	}

	if len(responseData.Results) == 0 || len(responseData.Results[0].Locations) == 0 {
		err = errors.New("Unable to find any results")
		return address, postcode, err
	}

	address = fmt.Sprintf(
		"%s, %s",
		responseData.Results[0].Locations[0].Street,
		responseData.Results[0].Locations[0].City,
	)
	postcode = responseData.Results[0].Locations[0].Postcode

	return
}

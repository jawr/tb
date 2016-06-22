package locations

import (
	"bytes"
	"database/sql/driver"
	"encoding/binary"
	"encoding/hex"
	"fmt"
)

// Point maps against Postgis geographical point
type Point struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

func NewPoint(lat, lng float64) Point {
	return Point{
		Lat: lat,
		Lng: lng,
	}
}

// Scan implements the Scanner interface and will scan the Postgis POINT(x y) into the Point struct
func (p *Point) Scan(val interface{}) error {
	b, err := hex.DecodeString(string(val.([]uint8)))
	if err != nil {
		return err
	}

	r := bytes.NewReader(b)
	var wkbByteOrder uint8
	if err := binary.Read(r, binary.LittleEndian, &wkbByteOrder); err != nil {
		return err
	}

	var byteOrder binary.ByteOrder
	switch wkbByteOrder {
	case 0:
		byteOrder = binary.BigEndian
	case 1:
		byteOrder = binary.LittleEndian
	default:
		return fmt.Errorf("invalid byte order %u", wkbByteOrder)
	}

	var wkbGeometryType uint64
	if err := binary.Read(r, byteOrder, &wkbGeometryType); err != nil {
		return err
	}

	if err := binary.Read(r, byteOrder, p); err != nil {
		return err
	}

	return nil
}

// Value implements the driver Valuer interface and will return the string representation of the Point struct by calling the String() method
func (p Point) Value() (driver.Value, error) {
	return fmt.Sprintf("POINT(%v %v)", p.Lat, p.Lng), nil
}

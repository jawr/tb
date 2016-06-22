DROP TABLE IF EXISTS category;
CREATE TABLE category (
	id serial,
	name text,
	PRIMARY KEY (id),
	UNIQUE (name)
);
	
DROP TABLE IF EXISTS activity;
CREATE TABLE activity (
	id serial,
	name text,
	slug text not null default '',
	category_id integer,
	PRIMARY KEY (id),
	UNIQUE (name, category_id)
);

DROP TABLE IF EXISTS keyword;
CREATE TABLE keyword (
	id serial,
	name text,
	PRIMARY KEY (id),
	UNIQUE (name)
);

DROP TABLE IF EXISTS location;
CREATE TABLE location (
	id serial,
	name text,
	point geography(point, 4326),
	PRIMARY KEY (id),
	UNIQUE (point)
);

DROP TABLE IF EXISTS activity_keywords;
CREATE TABLE activity_keywords (
	activity_id integer,
	keyword_id integer,
	UNIQUE (activity_id, keyword_id)
);

DROP TABLE IF EXISTS activity_locations;
CREATE TABLE activity_locations (
	activity_id integer,
	location_id integer,
	UNIQUE (activity_id, location_id)
);

-- insert functions

CREATE OR REPLACE FUNCTION insert_location(text, geography) RETURNS integer AS $$
	DECLARE
		_id integer;
	BEGIN
		INSERT INTO location (name, point) VALUES ($1, $2) RETURNING id INTO _id;
		RETURN _id;
	EXCEPTION WHEN UNIQUE_VIOLATION THEN
		SELECT id INTO _id FROM location WHERE point = $2;
		RETURN _id;
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE  FUNCTION insert_category(text) RETURNS integer AS $$
	DECLARE
		_id integer;
	BEGIN
		INSERT INTO category (name) VALUES ($1) RETURNING id INTO _id;
		RETURN _id;
	EXCEPTION WHEN UNIQUE_VIOLATION THEN
		SELECT id INTO _id FROM category WHERE name = $1;
		RETURN _id;
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE  FUNCTION insert_activity(text, integer) RETURNS integer AS $$
	DECLARE
		_id integer;
	BEGIN
		INSERT INTO activity (name, category_id) VALUES ($1, $2) RETURNING id INTO _id;
		RETURN _id;
	EXCEPTION WHEN UNIQUE_VIOLATION THEN
		SELECT id INTO _id FROM activity WHERE name = $1 AND category_id = $2;
		RETURN _id;
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE  FUNCTION insert_keyword(text) RETURNS integer AS $$
	DECLARE
		_id integer;
	BEGIN
		INSERT INTO keyword (name) VALUES ($1) RETURNING id INTO _id;
		RETURN _id;
	EXCEPTION WHEN UNIQUE_VIOLATION THEN
		SELECT id  INTO _id FROM keyword WHERE name = $1;
		RETURN _id;
	END;
$$ LANGUAGE plpgsql;


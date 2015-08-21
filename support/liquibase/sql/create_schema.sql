/* Create Sequences */
CREATE SEQUENCE configuration_sequence start with 1000;
CREATE SEQUENCE packaging_sequence start with 1000;
CREATE SEQUENCE categories_sequence start with 1000;
CREATE SEQUENCE products_sequence start with 1000;
CREATE SEQUENCE products_formats_sequence start with 1000;
CREATE SEQUENCE roles_sequence start with 1000;
CREATE SEQUENCE users_sequence start with 1000;
CREATE SEQUENCE users_sessions_sequence start with 1000;

/* Create Tables */

CREATE TABLE categories
(
	id bigint DEFAULT nextval('categories_sequence') NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	url varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE packaging
(
	id bigint DEFAULT nextval('packaging_sequence') NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (id)
) WITHOUT OIDS;

CREATE TABLE products
(
	id bigint DEFAULT nextval('products_sequence') NOT NULL,
	category_id bigint NOT NULL,
	packaging_id bigint NOT NULL,
	description varchar(255) NOT NULL UNIQUE,
	url varchar(255) NOT NULL UNIQUE,
	show_format boolean NOT NULL default false,
	PRIMARY KEY (id)
) WITHOUT OIDS;

CREATE TABLE products_pictures
(
	id bigint NOT NULL,
	picture bytea NOT NULL,
	last_update timestamp NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;

CREATE TABLE products_formats
(
	id bigint DEFAULT nextval('products_formats_sequence') NOT NULL,
	product_id bigint NOT NULL,
	format varchar(255) NOT NULL,
	quantity int4 NOT NULL,
	units int4 NOT NULL,
	wholesale float8 NOT NULL,
	retail float8 NOT NULL,
	PRIMARY KEY (id),
	UNIQUE(product_id,format)
) WITHOUT OIDS;

CREATE TABLE configuration
(
	id bigint DEFAULT nextval('configuration_sequence') NOT NULL,
	CONSTRAINT configuration_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE roles
(
	id bigint DEFAULT nextval('roles_sequence') NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE users
(
	id bigint DEFAULT nextval('users_sequence') NOT NULL,
	email_address varchar(256) NOT NULL UNIQUE,
	password varchar(255) NOT NULL,
	first_name varchar(256) NOT NULL,
	last_name varchar(256) NOT NULL,
	role_id bigint NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE users_sessions
(
	id bigint DEFAULT nextval('users_sessions_sequence') NOT NULL,
	last_access timestamp NOT NULL,
	token varchar(255) NOT NULL UNIQUE,
	user_id bigint,
	CONSTRAINT zintro_user_sessions_pkey PRIMARY KEY (id)
) WITHOUT OIDS;



/* Create Foreign Keys */

ALTER TABLE products
	ADD FOREIGN KEY (category_id)
	REFERENCES categories (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE products
	ADD FOREIGN KEY (packaging_id)
	REFERENCES packaging (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE products_pictures
	ADD FOREIGN KEY (id)
	REFERENCES products (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE products_formats
	ADD FOREIGN KEY (product_id)
	REFERENCES products (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE users
	ADD FOREIGN KEY (role_id)
	REFERENCES roles (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE users_sessions
	ADD FOREIGN KEY (user_id)
	REFERENCES users (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;




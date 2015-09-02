/* Create Sequences */
CREATE SEQUENCE configuration_sequence start with 1000;
CREATE SEQUENCE packaging_sequence start with 1000;
CREATE SEQUENCE categories_sequence start with 1000;
CREATE SEQUENCE products_sequence start with 1000;
CREATE SEQUENCE products_formats_sequence start with 1000;
CREATE SEQUENCE roles_sequence start with 1000;
CREATE SEQUENCE users_sequence start with 1000;
CREATE SEQUENCE users_sessions_sequence start with 1000;
CREATE SEQUENCE posters_sequence start with 1000;

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
	name varchar(255) NOT NULL UNIQUE,
	url varchar(255) NOT NULL UNIQUE,
	show_format boolean NOT NULL default false,
	is_visible boolean NOT NULL default false,
	is_offer boolean NOT NULL default false,
	PRIMARY KEY (id)
) WITHOUT OIDS;

CREATE TABLE products_pictures
(
	id bigint NOT NULL,
	content_type varchar(255) NOT NULL,
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

CREATE TABLE posters
(
	id bigint DEFAULT nextval('posters_sequence') NOT NULL,
	position int4 NOT NULL UNIQUE,
	content_type varchar(255) NOT NULL,
	last_update timestamp NOT NULL,
	category_id bigint NOT NULL,
	product_id bigint,
	PRIMARY KEY (id)
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

ALTER TABLE posters
	ADD FOREIGN KEY (product_id)
	REFERENCES products (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE posters
	ADD FOREIGN KEY (category_id)
	REFERENCES categories (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

CREATE VIEW plain_info AS
SELECT	pf.id AS pf_id,
		pf.format AS pf_format,
		pf.quantity AS pf_quantity,
		pf.units AS pf_units,
		pf.wholesale AS pf_wholesale,
		pf.retail AS pf_retail,
		p.id AS p_id,
		p.name AS p_name,
		p.url AS p_url,
		p.is_visible AS p_is_visible,
		p.is_offer AS p_is_offer,
		c.id AS c_id,
		c.name AS c_name,
		c.url AS c_url,
		pk.id AS pk_id,
		pk.name AS pk_name
FROM		products_formats pf, products p, categories c, packaging pk
WHERE	pf.product_id	= p.id	AND
		p.category_id	= c.id	AND
		p.packaging_id	= pk.id;


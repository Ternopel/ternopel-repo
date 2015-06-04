/* Create Sequences */

CREATE SEQUENCE users_sequence;
CREATE SEQUENCE users_sessions_sequence;



/* Create Tables */

CREATE TABLE categories
(
	id bigint NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE products
(
	id bigint NOT NULL,
	category_id bigint NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE configuration
(
	id bigint NOT NULL,
	CONSTRAINT configuration_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE roles
(
	id bigint NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE users
(
	id bigint DEFAULT nextval('users_sequence') NOT NULL,
	email_address varchar(256) NOT NULL UNIQUE,
	password varchar(255) NOT NULL,
	first_name varchar(256),
	last_name varchar(256),
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




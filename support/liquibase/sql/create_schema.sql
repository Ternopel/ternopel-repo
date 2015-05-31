
/* Drop Tables */

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS public.configuration;
DROP TABLE IF EXISTS public.users_sessions;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.roles;



/* Drop Sequences */

DROP SEQUENCE IF EXISTS users_sequence;




/* Create Sequences */

CREATE SEQUENCE users_sequence;



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


CREATE TABLE public.configuration
(
	id bigint NOT NULL,
	CONSTRAINT configuration_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.roles
(
	id bigint NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.users
(
	id bigint DEFAULT nextval('users_sequence') NOT NULL,
	email_address varchar(256) NOT NULL UNIQUE,
	password varchar(255) NOT NULL,
	first_name varchar(256),
	last_name varchar(256),
	role_id bigint NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.users_sessions
(
	id bigint NOT NULL,
	last_access timestamp NOT NULL,
	token varchar(255) NOT NULL,
	user_id bigint NOT NULL,
	CONSTRAINT zintro_user_sessions_pkey PRIMARY KEY (id)
) WITHOUT OIDS;



/* Create Foreign Keys */

ALTER TABLE products
	ADD FOREIGN KEY (category_id)
	REFERENCES categories (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE public.users
	ADD FOREIGN KEY (role_id)
	REFERENCES public.roles (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE public.users_sessions
	ADD FOREIGN KEY (user_id)
	REFERENCES public.users (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;




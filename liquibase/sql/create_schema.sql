
/* Drop Indexes */

DROP INDEX IF EXISTS permissions_clazz_method_key;
DROP INDEX IF EXISTS role_permissions_role_id_permission_id_key;



/* Drop Tables */

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS public.configuration;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.zintro_user_sessions;
DROP TABLE IF EXISTS public.zintro_user;




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


CREATE TABLE public.permissions
(
	id bigint NOT NULL,
	page varchar(255) NOT NULL,
	tag varchar(255) NOT NULL,
	permission_name varchar(255) NOT NULL,
	CONSTRAINT permissions_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.roles
(
	id bigint NOT NULL,
	name varchar(255) NOT NULL UNIQUE,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.role_permissions
(
	id bigint NOT NULL,
	permission_id bigint NOT NULL,
	role_id bigint NOT NULL,
	CONSTRAINT role_permissions_pkey PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.zintro_user
(
	id bigint NOT NULL,
	email_address varchar(256) NOT NULL UNIQUE,
	first_name varchar(256),
	last_name varchar(256),
	PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE public.zintro_user_sessions
(
	id bigint NOT NULL,
	last_access timestamp NOT NULL,
	token varchar(255) NOT NULL,
	zintro_user_id bigint NOT NULL,
	CONSTRAINT zintro_user_sessions_pkey PRIMARY KEY (id)
) WITHOUT OIDS;



/* Create Foreign Keys */

ALTER TABLE products
	ADD FOREIGN KEY (category_id)
	REFERENCES categories (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE public.role_permissions
	ADD CONSTRAINT fkead9d23bb0963ac FOREIGN KEY (permission_id)
	REFERENCES public.permissions (id)
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
;


ALTER TABLE public.role_permissions
	ADD CONSTRAINT fkead9d23bab033cc FOREIGN KEY (role_id)
	REFERENCES public.roles (id)
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
;


ALTER TABLE public.zintro_user_sessions
	ADD FOREIGN KEY (zintro_user_id)
	REFERENCES public.zintro_user (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



/* Create Indexes */

CREATE UNIQUE INDEX permissions_clazz_method_key ON public.permissions USING BTREE (page, tag);
CREATE UNIQUE INDEX role_permissions_role_id_permission_id_key ON public.role_permissions USING BTREE (role_id, permission_id);




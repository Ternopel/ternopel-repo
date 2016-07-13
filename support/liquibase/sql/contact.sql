drop table if exists contact;
drop sequence if exists contact_sequence;

CREATE SEQUENCE contact_sequence start with 1000;

CREATE TABLE contact
(
	id bigint DEFAULT nextval('contact_sequence') NOT NULL,
	email_address varchar(256) NOT NULL,
	first_name varchar(256) NOT NULL,
	last_name varchar(256) NOT NULL,
	comments varchar(8096) NOT NULL,
	sent boolean NOT NULL default false,
	PRIMARY KEY (id)
) WITHOUT OIDS;

DROP TABLE IF EXISTS transactions_detail;
DROP TABLE IF EXISTS transactions_header;

DROP SEQUENCE IF EXISTS transactions_header_sequence;
DROP SEQUENCE IF EXISTS transactions_detail_sequence;

CREATE SEQUENCE transactions_header_sequence start with 1000;
CREATE SEQUENCE transactions_detail_sequence start with 1000;

CREATE TABLE transactions_header
(
	id bigint DEFAULT nextval('transactions_header_sequence') NOT NULL,
	user_id bigint NOT NULL,
	purchase_date timestamp NOT NULL,
	delivery_type int4 NOT NULL,
	payment_type int4 NOT NULL,
	total_purchase float8 NOT NULL,
	mail_sent boolean NOT NULL,
	CONSTRAINT transactions_header_pkey PRIMARY KEY (id)
) 
WITHOUT OIDS;

ALTER TABLE transactions_header
	ADD FOREIGN KEY (user_id)
	REFERENCES users (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

CREATE TABLE transactions_detail
(
	id bigint DEFAULT nextval('transactions_detail_sequence') NOT NULL,
	transaction_header_id bigint NOT NULL,
	product_format_id bigint NOT NULL,
	quantity float8 NOT NULL,
	price float8 NOT NULL,
	CONSTRAINT transactions_detail_pkey PRIMARY KEY (id)
) 
WITHOUT OIDS;

ALTER TABLE transactions_detail
	ADD FOREIGN KEY (transaction_header_id)
	REFERENCES transactions_header (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE transactions_detail
	ADD FOREIGN KEY (product_format_id)
	REFERENCES products_formats (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


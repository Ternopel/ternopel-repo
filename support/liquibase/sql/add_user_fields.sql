alter table users drop column if exists address;
alter table users add column address  varchar(255);

alter table users drop column if exists city;
alter table users add column city varchar(255);

alter table users drop column if exists telephone;
alter table users add column telephone varchar(255);

alter table users drop column if exists zipcode;
alter table users add column zipcode numeric(4);

alter table users drop column if exists state;
alter table users add column state numeric(2);



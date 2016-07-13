alter table transactions_header drop column if exists comments;
alter table transactions_header add column comments varchar(4096);


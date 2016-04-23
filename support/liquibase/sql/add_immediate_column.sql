alter table mailing drop column if exists immediate;
alter table mailing add column immediate boolean default false;
update mailing set immediate = false;
alter table mailing alter column immediate set not null;

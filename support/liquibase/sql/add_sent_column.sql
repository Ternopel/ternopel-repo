alter table registrations drop column if exists sent;
alter table registrations add column sent boolean;
update registrations set sent = true, verified = true;
alter table registrations alter column sent set not null;

alter table mailing drop column if exists sent;
alter table mailing add column sent boolean;
update mailing set sent = true, verified = true;
alter table mailing alter column sent set not null;

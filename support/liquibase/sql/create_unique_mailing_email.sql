drop index if exists mailing_email;
create unique index mailing_email on mailing( email_address );

drop index if exists registrations_email;
create unique index registrations_email on registrations( email_address );


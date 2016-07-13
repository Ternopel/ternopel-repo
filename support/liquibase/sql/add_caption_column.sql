alter table posters drop column if exists caption;
alter table posters add column caption varchar(512) default 'Mensaje';
alter table posters alter column caption set not null;

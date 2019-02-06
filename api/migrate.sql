drop table if exists reports;
create table reports (
    id serial primary key,
    timestamp timestamp not null default now(),
    data text[]
);
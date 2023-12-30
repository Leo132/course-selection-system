create database if not exists myschooldb;

use myschooldb;

create table if not exists departments (
    d_id char(4),
    name_ char(10) not null,
    director char(4),
    primary key(d_id)
);

create table if not exists students (
    s_id char(5),
    name_ char(4) not null,
    d_id char(4),
    primary key(s_id),
    foreign key(d_id) references departments(d_id)
);

create table if not exists courses (
    c_id char(4),
    name_ char(10) not null,
    score int,
    primary key(c_id)
);

create table if not exists selecting (
    s_id char(4),
    c_id char(4),
    score int,
    primary key(s_id, c_id),
    foreign key(s_id) references students(s_id),
    foreign key(c_id) references courses(c_id)
);

insert into departments values
    ("D001", "資工系", "李主任"),
    ("D002", "資管系", "林主任");


insert into students values
    ("S0001", "一心", "D001"),
    ("S0002", "二聖", "D002"),
    ("S0003", "三多", "D002"),
    ("S0004", "四維", "D002"),
    ("S0005", "五福", "D002");

insert into courses values
    ("C001", "資料庫系統", '4'),
    ("C002", "手機程式", '4'),
    ("C003", "機器人程式", '3'),
    ("C004", "物聯網技術", '4'),
    ("C005", "大數據分析", '3');

-- insert into selecting values
--     ("S0001", "C001"),
--     ("S0001", "C005"),
--     ("S0002", "C001"),
--     ("S0002", "C005");

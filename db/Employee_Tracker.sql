DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker; 

CREATE TABLE Employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30)NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE Role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30)NOT NULL,
    salary DECIMAL NOT NULL,
    PRIMARY KEY (id)

)

CREATE TABLE Department (
    id INT AUTO_INCREMENT,
    name VARCHAR (30)NOT NULL,
    PRIMARY KEY (id)
)
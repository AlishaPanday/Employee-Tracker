USE employee_tracker; 

INSERT INTO Department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO Role 
    (title, salary,department_id)
VALUES 
    ('Sales Manager', 110000, 1),
    ('Sales Person', 75000, 1),

    ('Mechanical Engineer', 120000, 2),
    ('Software Engineer', 130000, 2),

    ('Account Manager', 150000, 3),
    ('Accountant', 115000,3),

    ('Legal Advisor Lead', 180000,4),
    ('Lawyer', 165000, 4);

INSERT INTO Employee 
    (first_name,last_name,role_id, manager_id)
VALUES 
    ('Alisha', 'Panday', 1, NULL),
    ('Prani', 'Raj', 2, 1),
    ('Manisha', 'Luhar', 3, NULL),
    ('Yubaraj', 'Dahal', 4, 3),
    ('Renu', 'Saini', 5, NULL),
    ('Adi', 'Trehan', 6, 5),
    ('Riri', 'Ganguly', 7, NULL),
    ('Tush', 'Sharma', 8, 7);



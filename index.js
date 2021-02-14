const inquirer = require ('inquirer');
const mysql = require('mysql');
require('console.table');
//Select an option from the list using inquirer
//1) VIEW all Depatments 
//2) VIEW all Roles
//3) VIEW all employees
//4) Add department
//5) Add employees
//6) Update Employee Roles
//7) QUIT
//Creating connection 


const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database:'Employee_Tracker',
});

connection.connect();


function runList() {
    inquirer.prompt (
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'option',
            choices: [
                'View all departments',
                'View all Roles',
                'View all employees',
                'Add department',
                'Add Roles',
                'Add Employees',
                'Update Employee Roles'
            ]
    
        }).then(answer => {
           
            switch (answer.option) {
                case"View all departments":
                    viewAllDepartments();
                break;

                case"View all Roles":
                    viewAllRoles();
                break;

                case"View all employees":
                    viewAllEmployees();
                break;

                case"":
                break;

                case"":
                break;

                case"":
                break;

                case"":
                break;

                case"":
                break;
            }
        })
}
runList();

function viewAllDepartments() {
    connection.query(
        'SELECT * FROM Department', (err, res) => {
            if(err){
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}

function viewAllRoles() {
    connection.query(
        'SELECT * FROM role', (err, res) => {
            if(err){
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}

function viewAllEmployees() {
    connection.query(
        'SELECT * FROM role', (err, res) => {
            if(err){
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}


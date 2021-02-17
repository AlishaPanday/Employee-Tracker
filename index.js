const inquirer = require ('inquirer');
const mysql = require('mysql2');

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
                'Update Employee Roles',
                'Exit'
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

                case"Add department":
                    addDepartment();
                break;

                case"Add Roles":
                    addRoles();
                break;

                case"Add Employees":
                    addEmployees()
                break;

                case"Update Employee Roles":
                break;

                case"Exit":
                    connection.end();
                    console.log('Have a good day');
                break;
            }
        })
}


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
        'SELECT * FROM employee', (err, res) => {
            if(err){
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}

function addDepartment() {
    inquirer.prompt([

        {
            type:'input',
            name:'department',
            message:'Please add a department name:'
        }

    ]).then(answer => {
        console.log(answer);
        connection.query('INSERT INTO department SET?',{name:answer.department}, (err,res) =>{
            if (err) throw err;
            console.log('Added new department')
        });
    });
}

function addRoles() {
    console.log('aa');

    // query all the depts
    connection.promise().query("SELECT * FROM Department")
        .then((res) => {
            // make the choice dept arr
            return res[0].map(dept => {
                return {
                    name: dept.name,
                    value: dept.id
                }
            })
        })
        .then((departments) => {
            
            return inquirer.prompt([

                {
                    type:'input',
                    name:'roles',
                    message:'Please add a role:'
                },
        
                {
                    type:'input',
                    name:'salary',
                    message:'Please enter a salary:'
                },
        
                {
                    type:'list',
                    name:'depts',
                    choices: departments,
                    message:'Please select your department.'
                }
            ])
        })

    .then(answer => {
        console.log(answer);
        return connection.promise().query('INSERT INTO role SET ?',{title:answer.roles, salary:answer.salary,department_id: answer.depts});
    })
    .then(res => {
        console.log('Added new role')
        runList();

    })
    .catch(err => {
        throw err
    });
}

function addEmployees() {
    console.log('aa');
    inquirer.prompt([

        {
            type:'input',
            name:'firstname',
            message:'Please enter first name:'
        },

        {
            type:'input',
            name:'lastname',
            message:'Please enter last name:'
        },

        {
            type:'input',
            name:'roleId',
            message:'Please enter role id:'
        },

        {
            type:'input',
            name:'managerId',
            message:'Please enter manager id:'
        }
    ]).then(answer => {
        console.log(answer);
        connection.query('INSERT INTO employee SET?',{first_name:answer.firstname,last_name:answer.lastname,role_id: answer.roleId,manager_id: answer.managerId }, (err,res) =>{
            if (err) throw err;
            console.log('Added new employee')
        });
    });
}
runList();


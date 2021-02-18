const inquirer = require('inquirer');
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Employee_Tracker',
});

connection.connect();


function runList() {
    inquirer.prompt(
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
                'Delete Departments',
                'Delete Employee',
                'Delete Roles',
                'Update employee manager',
                'View Employee By Manager',
                'Exit'
            ]

        }).then(answer => {

            switch (answer.option) {
                case "View all departments":
                    viewAllDepartments();
                    break;

                case "View all Roles":
                    viewAllRoles();
                    break;

                case "View all employees":
                    viewAllEmployees();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add Roles":
                    addRoles();
                    break;

                case "Add Employees":
                    addEmployee();
                    break;

                case "Update Employee Roles":
                    updateEmployeeRole();
                    break;

                case "Delete Departments":
                    deleteDepartment();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                case "Delete Roles":
                    deleteRole();
                    break;
                case "Update employee manager":
                    updateManager()
                    break;
                case "View Employee By Manager":
                    viewEmployeeByManager()
                    break;
                case "Exit":
                    connection.end();
                    console.log('Have a good day');
                    break;
            }
        })
}


function viewAllDepartments() {
    connection.query(
        'SELECT * FROM Department', (err, res) => {
            if (err) {
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
            if (err) {
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
            if (err) {
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
            type: 'input',
            name: 'department',
            message: 'Please add a department name:'
        }

    ]).then(answer => {
        console.log(answer);
        connection.query('INSERT INTO department SET?', { name: answer.department }, (err, res) => {
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
                    type: 'input',
                    name: 'roles',
                    message: 'Please add a role:'
                },

                {
                    type: 'input',
                    name: 'salary',
                    message: 'Please enter a salary:'
                },

                {
                    type: 'list',
                    name: 'depts',
                    choices: departments,
                    message: 'Please select your department.'
                }
            ])
        })

        .then(answer => {
            console.log(answer);
            return connection.promise().query('INSERT INTO role SET ?', { title: answer.roles, salary: answer.salary, department_id: answer.depts });
        })
        .then(res => {
            console.log('Added new role')
            runList();

        })
        .catch(err => {
            throw err
        });
}


var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (res) {
        let roleId = selectRole().indexOf(res.role) + 1
        let managerId = selectManager().indexOf(res.choice) + 1
        connection.query("INSERT INTO Employee SET ?",
            {
                first_name: res.firstname,
                last_name: res.lastname,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(res)
                runList();
            })

    })
}


function updateEmployeeRole() {
    connection.query("SELECT employee.last_name, role.title  FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        // console.log(res)
        if (err) throw err
        inquirer.prompt([
            {
                name: "lastName",
                type: "rawlist",
                choices: function () {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the employee's last name? ",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: selectRole()
            },
        ]).then(function (response) {
            ;
            let roleId = selectRole().indexOf(response.role) + 1
            console.log(roleId);
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {

                        role_id: roleId

                    },
                    {
                        last_name: response.lastName

                    },
                ], function (err) {
                    if (err) throw err
                    console.table(response)
                    runList();
                })

        })
    })

}

function deleteDepartment() {
    connection.promise().query('SELECT * FROM Department')
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
                    type: 'list',
                    name: 'deptId',
                    choices: departments,
                    message: 'Please select the department you want to delete.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query('DELETE FROM Department WHERE id = ?', answer.deptId);

        })
        .then(res => {
            // console.log(res);
            console.log('Department Deleted Successfully')
            runList();
        })

        .catch(err => {
            throw err
        });

}

function deleteEmployee() {
    connection.promise().query('SELECT * FROM employee')
        .then((res) => {
            // make the choice dept arr
            return res[0].map(emp => {
                return {
                    name: emp.first_name,
                    value: emp.id
                }
            })
        })
        .then((employees) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    choices: employees,
                    message: 'Please select the employee you want to delete.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query('DELETE FROM Employee WHERE id = ?', answer.employeeId);

        })
        .then(res => {
            // console.log(res);
            console.log('Employee Deleted Successfully')
            runList();
        })

        .catch(err => {
            throw err
        });

}

function deleteRole() {
    connection.promise().query('SELECT title, id FROM role')
        .then((res) => {
            // make the choice dept arr
            return res[0].map(roles => {
                return {
                    name: roles.title,
                    value: roles.id
                }
            })
        })
        .then((employeeRoles) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleId',
                    choices: employeeRoles,
                    message: 'Please select the employee you want to delete.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query('DELETE FROM Role WHERE id = ?', answer.roleId);

        })
        .then(res => {
            // console.log(res);
            console.log('Role Deleted Successfully')
            runList();
        })

        .catch(err => {
            throw err
        });

}


function updateManager() {
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            // make the choice dept arr
            return res[0].map(employee => {
                return {
                    name: employee.first_name,
                    value: employee.id
                }
            })
        })
        .then((employeeList) => {
            return inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Please select the employee you want to assign manager to:.'
                },
                {
                    type: 'rawlist',
                    name: 'managerId',
                    choices: employeeList,
                    message: 'Please select the employee you want to make manager.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query("UPDATE employee SET ? WHERE ?",
                [
                    {

                        first_name: answer.employeeListId


                    },
                    {

                        manager_id: answer.managerId

                    }
                ]


            );

        })
        .then(res => {
            // console.log(res);
            console.log('Updated Manager Successfully')
            runList();
        })

        .catch(err => {
            throw err
        });

}

function viewEmployeeByManager() {
    connection.query(
        'SELECT first_name, last_name, role_id FROM employee  WHERE manager_id IS NOT NULL', (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}

runList();
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
                'Delete Departments',
                'Delete Employee',
                'Delete Roles',
                'Update Employee Roles',
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
        'SELECT employee.id, first_name, last_name, title AS Job_title, salary, manager_id AS manager FROM employee, role WHERE role.id = employee.role_id ', (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}

function viewAllEmployees() {
    const sql = 'Select emp.id as EmployeeID, concat(emp.first_name,"  ",emp.last_name ) as EmployeeName , ro.title as Job_tittle, ro.salary as Salary,dept.name as Department_Name,concat(emp2.first_name,"  ",emp2.last_name) as ManagerName from employee_tracker.employee as emp inner join employee_tracker.employee as emp2 on emp2.id=emp.manager_id inner join employee_tracker.Role as ro on emp.role_id=ro.id inner join employee_tracker.department as dept on dept.id = ro.department_id';
    connection.query(
        sql, 
        (err, res) => {
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
            runList();
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


function selectRole() {
    return connection.promise().query("SELECT * FROM role")
        .then(res => {
            return res[0].map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        })
}


function selectManager() {
    return connection.promise().query("SELECT * FROM employee where manager_id is not null")
        .then(res => {
            return res[0].map(manager => {
                return {
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id,
                }
            })
        })

}

async function addEmployee() {

    const managers = await selectManager();


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
            choices: await selectRole()
        },
        {
            name: "manager",
            type: "list",
            message: "Whats their managers name?",
            choices: managers
        }
    ]).then(function (res) {
        let roleId = res.role
        let managerId = res.manager

        console.log({managerId});
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
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            return res[0].map(employee => {
                return {
                    name: employee.first_name,
                    value: employee.id
                }
            })
        })
        .then(async (employeeList) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Please select the employee you want to update a role:.'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    choices: await selectRole(),
                    message: 'Please select the role.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  role_id = ? WHERE id = ?",

                    [
                        answer.roleId,
                        answer.employeeListId,
                    ],


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
        .then(async (employeeList) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Please select the employee you want to assign manager to:.'
                },
                {
                    type: 'list',
                    name: 'managerId',
                    choices: await selectManager(),
                    message: 'Please select the employee you want to make manager.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  manager_id = ? WHERE id = ?",

                    [
                        answer.managerId,
                        answer.employeeListId,
                    ],


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
        'SELECT first_name, last_name, role_id, manager_id FROM employee  WHERE manager_id IS NOT NULL', (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res)
            runList();
        }
    )
}

runList();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// const inquirer = require('inquirer');
// const mysql = require('mysql');
// // SELECT AN OPTION:
// // 1) DISPLAY SONGS BY ARTIST NAME
// //      - ARTIST NAME (FREE TEXT)
// // 2) SHOW ARTIST IN LIST MORE THAN ONCE
// // 3) SELECT DATA BETWEEN YEARS
// //      - FROM YEAR, TO YEAR
// // 4) DISPLAY SONGS BY SONG TITLE
// //      - SONG TITLE (FREE TEXT)
// const CHOICES = [
//     { name: 'View all Employee', value: 1 },
//     { name: 'Update Employee Role', value: 2 },
//     { name: 'Update Employee by Manager', value: 3 },
//     { name: 'View Employee by Manager', value: 4 },
//     { name: 'View Salary of all employees in that department', value: 5 }
// ];
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'Employee_Tracker',
// });
// connection.connect();
// inquirer
//     .prompt([
//         {
//             type: 'list',
//             name: 'option',
//             message: 'Select an option:',
//             choices: CHOICES,
//         },
//     ])
//     .then(({ option }) => {
//         switch (option) {
//             case 1:
                
//                 break;
//             case 2:
                
//                 break;
//             case 3:
                
//                 break;
//             case 4:
                
//                 break;
//             case 5:
                
//                 break;
//             default:
//                 throw 'Something went wrong.';
//         }
//     });

//     const viewAllEmployee = () => inquirer
//     .prompt ([
//         {
//             type:
//             name:
//             message:
//             choices:
//         }
//     ])

    
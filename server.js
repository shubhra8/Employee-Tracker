const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Manager1 = require('./lib/Manager.js');
const rows=[];


const PORT = process.env.PORT || 3001;
//const app = express();

// Express middleware
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Reader@1212',
    database: 'company_db'
  },
  console.log(`Connected to the company database.`)
);

//Get Department Table Data
 const Dept=() => {
   return new Promise((resolve, reject) => {
       db.query('select id,name from department', (err, rows) => {
         err ? reject(err) : resolve(rows)
})
 })
}
//Get Role Table Data
 const Role=() => {
   return new Promise((resolve, reject) => {
       db.query('select id,title from role', (err, rows) => {
         err ? reject(err) : resolve(rows)
})
 })
}
//Get Employee Manager Info
const Manager=()=>{
  return new Promise((resolve, reject) => {
       db.query('SELECT a.id AS "Emp_ID",a.first_name AS "EmployeeName", b.first_name AS "ManagerName" FROM employee a, employee b WHERE a.manager_id = b.id;', (err, rows) => {
         err ? reject(err) : resolve(rows)
})
 })
}
//Get Employees  First Name
const Employee=()=>{
  return new Promise((resolve, reject) => {
       db.query('SELECT first_name from employee;', (err, rows) => {
         err ? reject(err) : resolve(rows)
})
 })
}


///To Add the New Department
  async function addDepartment() {
    const data = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter the Department name',
        },
    ]);
    db.query(`INSERT INTO department (name) VALUES ('${data.department}');`, (err, rows) => {
        if (err) {
            //res.status(500).json({ error: err.message });
            return "shubhra";
        }
        console.log("Department Added");
        init();
    });
}
/////To Show Manager Info

  function showManagers() {
    
    db.query(`select a.first_name as Employees,b.first_name as Manager from employee a,employee b where a.manager_id = b.id;`, (err, rows) => {
        if (err) {
            //res.status(500).json({ error: err.message });
            return "shubhra";
        }
        
        console.table(rows);
        init();
    });
}
/////To Show Employee Department Info
 function showempDepartment() {
    
    db.query(`select employee.first_name as "Employee Name",department.name as "Department Name" from employee,role,department where employee.role_id=role.id and role.department_id=department.id `, (err, rows) => {
        if (err) {
            //res.status(500).json({ error: err.message });
            return "shubhra";
        }
        console.table(rows);
        init();
    });
  }
  ////// To Show Budget
 function showbudgetDepartment() {
   
      
  db.query(`select name,sum(salary) from role,department where role.department_id=department.id group by(name);`, (err, rows) => {
        if (err) {
            //res.status(500).json({ error: err.message });
            return "error";
        }
        console.table(rows);
        init();
    });

 }
  ///////
/////To Update Employee Role 
 async function updateEmployee() {
  try {
     const empArray1 = await Employee();
     const employee1 = [];
     for (let i=0; i<empArray1.length; i++) {
                employee1.push(empArray1[i].first_name);
            }
     const roleArray1 = await Role();
    const title1 = [];
     for (let i=0; i<roleArray1.length; i++) {
                title1.push(roleArray1[i].title);
            }
    const data = await inquirer.prompt([
              {      
                    name: 'upemp',
                    type: "list",
                    message: 'Choose employee ',
                    choices: employee1,
                 },
                 {      
                    name: 'title1',
                    type: "list",
                    message: 'Choose New Role ',
                    choices: title1,
                 },
    ]);
    db.query(`update employee set role_id = (select id from role where title = '${data.title1}') where first_name = '${data.upemp}';`, (err, rows) => {
        if (err) {
            //res.status(500).json({ error: err.message });
            return "shubhra";
        }
        console.log("Role Updated");
        init();
    });
  }
           catch (error) {
   res.status(500).json(error)
  }
}
/////To Add New Employee
const addEmployee = async (req, res) =>   {   
  
  try {
    
    const empArray = await Role();
    const empTitle = [];
      for (let i=0; i<empArray.length; i++) {
                empTitle.push(empArray[i].title);
            }
      const manArray = await Manager();
    //  console.log(manArray);
      const manager = [];
      for (let i=0; i<manArray.length; i++) {
        //if (manager.includes(manArray[i].ManagerName) === false)
          manager.push(manArray[i].EmployeeName)
          
      }
      //console.log(manager)
 

  
    const data = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: 'Enter the first name of the employee',
                },
                 {
                    type: 'input',
                    name: 'last',
                    message: 'Enter the last name of the employee',
                },
            
                 {
                    
                    name: 'titleChoices',
                    type: "list",
                    message: 'Choose title for the role',
                    choices: empTitle,
                 },
                 {
                    
                    name: 'Manager',
                    type: "list",
                    message: 'Choosee Manager for the Employee',
                    choices: manager,
                 },
            ]);
           const roleidEmp = empArray[empTitle.indexOf(`${data.titleChoices}`)].id;
           const manId=manArray[manager.indexOf(`${data.Manager}`)].Emp_ID;
           console.log(manId);
            db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${data.first}','${data.last}','${roleidEmp}','${manId}');`, (err, rows) => {
                if (err) {
                    //res.status(500).json({ error: err.message });
                    return "shubhra";
                }
                console.log("Employee Added");
                init();
            });
  } 
            
            catch (error) {
   res.status(500).json(error)
  }
        }

/////// To add New Role

const addRole = async (req, res) =>   {   
  
  try {
    //dowork 
    const deptArray = await Dept();
    const deptNames = [];
      for (let i=0; i<deptArray.length; i++) {
                deptNames.push(deptArray[i].name);
            }
  
    const data = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the Title for the Role',
                },
                 {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for the Role',
                },
            
                 {
                    
                    name: 'choices',
                    type: "list",
                    message: 'Enter id of your department',
                    choices: deptNames,
                 },
            ]);
           const deptId = deptArray[deptNames.indexOf(`${data.choices}`)].id;
            db.query(`INSERT INTO role (title,salary,department_id) VALUES ('${data.title}','${data.salary}','${deptId}');`, (err, rows) => {
                if (err) {
                    //res.status(500).json({ error: err.message });
                    return "shubhra";
                }
                console.log("Role Added");
                init();
            });
  } 
            
            catch (error) {
   res.status(500).json(error)
  }
        }

  const prompt = () => {
  return inquirer.prompt([
{
      name: 'choices',
      type: "list",
      message: 'Choose any option',
      choices: ["List Departments","List Roles","List Employees","Add Department","Add Role","Add Employee","Update Employee","View Employees By Manager","View Employees By Department","Show Budget Department wise"],
}
]) 
}


  
  const init = () => {
    prompt()
  .then((data) =>{
    return chooseOption(data);
  }
)}
//Main Menu for options
   const chooseOption = (data) => { 
    if(data.choices === "List Departments"){
     db.query('select * from department', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.table(rows)
    init();
    
    });
    }
    else if (data.choices === "List Roles"){
     db.query('select role.id,role.title,role.salary,department.name from role,department where department.id=role.department_id;', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.table(rows)
    init();
    });
    
    }
    else if (data.choices === "List Employees"){
     db.query('select department.name,role.title,role.salary,a.first_name,a.last_name,a.id,b.first_name As "Manager Name" from department,role,employee a,employee b where role.id=a.role_id and department.id=role.department_id and  a.manager_id = b.id;', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.table(rows)
    init();
    });
    
    }
    else if (data.choices === "Add Department"){
         
     addDepartment();
    }
    else if (data.choices === "Add Role"){
         
     addRole();
    }
    else if (data.choices === "Add Employee"){
      addEmployee();
    }
     else if (data.choices === "Update Employee"){
      updateEmployee();
    }
     else if (data.choices === "View Employees By Manager"){
      showManagers();
    }
    else if (data.choices === "View Employees By Department"){
      showempDepartment();
    }
     else if (data.choices === "Show Budget Department wise"){
      showbudgetDepartment();
    }

}
    

  
init();

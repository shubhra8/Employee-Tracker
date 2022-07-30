DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) 
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT fk_dept_id FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE SET NULL,
  CONSTRAINT fk_manager FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
   
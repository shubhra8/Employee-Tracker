INSERT INTO department (id,name)
VALUES (2,"Fianace"),
       (3,"Human Resources"),
       (4,"Marketing"),
       (1,"Sales"),
       (5 ,"Engineering");

INSERT INTO role (title, salary,department_id)
VALUES ('Software Engineering Manager', 90000,5),
       ('Software Engineer', 70000,5),
       ('Software Engineering Director', 130000,5);
     
  INSERT INTO employee (first_name, last_name)
VALUES ('John','Davis'),
       ('Shubhra','Salunke'),
       ('Reet','Pawar'),
       ('Kelly','Morgan'),
       ('Jimmy','Shergil');

  UPDATE employee SET role_id =  (select id from role where title='Software Engineering Director')
  where first_name = 'Shubhra';


  UPDATE employee SET role_id =  (select id from role where title='Software Engineer')
  where first_name in ('John','Reet','Jimmy');

  
  UPDATE employee SET role_id =  (select id from role where title='Software Engineering Manager')
  where first_name in ('Kelly');

  
  -- UPDATE employee SET manager_id = 4 where first_name in ('John','Reet','Jimmy');

  
  -- UPDATE employee SET manager_id = 2 where first_name in ('Kelly');

  
  -- UPDATE employee SET manager_id = 2 where first_name in ('Shubhra');

  

       
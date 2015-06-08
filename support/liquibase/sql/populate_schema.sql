INSERT INTO roles (id,name) VALUES 
(1,'admin'),
(2,'client');

INSERT INTO users (email_address,first_name,last_name,password,role_id) VALUES
('mcarrizo@ternopel.com','Admin','User','5c969619',1),
('mcarrizo@gmail.com','Client','User','5c969619',2);

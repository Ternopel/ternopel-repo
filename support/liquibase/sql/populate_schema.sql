INSERT INTO roles (id,name) VALUES 
(1,'admin'),
(2,'client');

INSERT INTO users (id,email_address,first_name,last_name,password,role_id) VALUES
(1,'mcarrizo@ternopel.com','Admin','User','tyBPkkC6TEX3I3rEl2/agFtohCc=',1),
(2,'mcarrizo@gmail.com','Client','User','tyBPkkC6TEX3I3rEl2/agFtohCc=',2);

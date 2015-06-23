INSERT INTO roles (id,name) VALUES 
(1,'admin'),
(2,'client');

INSERT INTO users (email_address,first_name,last_name,password,role_id) VALUES
('mcarrizo@ternopel.com','Maxi','Admin','5c969619',1),
('mcarrizo@gmail.com','Maxi','Client','5c969619',2),
('smarmo@ternopel.com','Sergio','Admin','42929c',1),
('smarmo@gmail.com','Sergio','Client','42929c',2);


INSERT INTO categories (id,name,url) VALUES 
(1,'Bandas elásticas','bandas-elasticas'),
(2,'Bandejas','bandejas'),
(3,'Blondas de papel','blondas-de-papel'),
(4,'Bobinas','bobinas'),
(5,'Bolsas','bolsas'),
(6,'Bombonera','bombonera'),
(7,'Cajas','cajas'),
(8,'Carteles','carteles'),
(9,'Cartón corrugado','carton-corrugado'),
(10,'Cintas','cintas'),
(11,'Cubiertos','cubiertos'),
(12,'Ensaladeras','ensaladeras'),
(13,'Etiquetas','etiquetas'),
(14,'Film strech','film-strech'),
(15,'Fundas','fundas'),
(16,'Guantes','guantes'),
(17,'Hilos y cintas','hilos-y-cintas'),
(18,'Láminas','laminas'),
(19,'Moldes de papel','moldes-de-papel'),
(20,'Moños','monos'),
(21,'Papeles','papeles'),
(22,'Pirotines','pirotines'),
(23,'Platos','platos'),
(24,'Portapanchos','portapanchos'),
(25,'Potes','potes'),
(26,'Precintos','precintos'),
(27,'Resmas','resmas'),
(28,'Rollos','rollos'),
(29,'Servilletas','servilletas'),
(30,'Sobres','sobres'),
(31,'Sorbetes','sorbetes'),
(32,'Talonarios','talonarios'),
(33,'Tapas','tapas'),
(34,'Torteras plásticas','torteras-plasticas'),
(35,'Trípodes','tripodes'),
(36,'Vasos','vasos');


/* Bandas elasticas */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(1,1,'BOLSA','Bolsa de banditas elásticas','bolsa-bandas-elasticas');

INSERT INTO products_formats (id,product_id,format,units,wholesale,retail) VALUES 
(1,1,'Bolsa por 1000 gramos',10,576,65),
(2,1,'Bolsa por 500 gramos',10,300,33),
(3,1,'Bolsa por 100 gramos',10,80,10);

/* Bolsas economicas */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(2,5,'BOLSA','Bolsas de camisetas económicas','bolsas-camisetas-economicas');

INSERT INTO products_formats (id,product_id,format,units,wholesale,retail) VALUES 
(4,2,'Bolsa por 1000 gramos',10,576,65),
(5,2,'Bolsa por 500 gramos',10,300,33),
(6,2,'Bolsa por 100 gramos',10,80,10);



/* Bolsas reforzadas */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(3,5,'BOLSA','Bolsas de camisetas reforzadas','bolsas-camisetas-reforzadas');

/* Bolsas consorcio */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(4,5,'BOLSA','Bolsas de consorcio','bolsas-consorcio');

/* Bolsas residuos */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(5,5,'BOLSA','Bolsas de residuos','bolsas-residuos');

/* Bolsas papel sulfito */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(6,5,'BOLSA','Bolsas de papel sulfito','bolsas-papel-sulfito');

/* Bolsas polipropileno */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(7,5,'BOLSA','Bolsas de polipropileno','bolsas-polipropileno');

/* Bolsas con manija */
INSERT INTO products (id,category_id,packaging,description,url) VALUES 
(8,5,'BOLSA','Bolsas de papel con manija','bolsas-papel-manija');


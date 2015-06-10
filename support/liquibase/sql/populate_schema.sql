INSERT INTO roles (id,name) VALUES 
(1,'admin'),
(2,'client');

INSERT INTO users (email_address,first_name,last_name,password,role_id) VALUES
('mcarrizo@ternopel.com','Admin','User','5c969619',1),
('mcarrizo@gmail.com','Client','User','5c969619',2);



INSERT INTO categories (id,name) VALUES 
(1,'Vasos De Cristal Y Varios'),
(2,'Ensaladeras Plasticas'),
(3,'Potes Y Tapas Plasticas'),
(4,'Bobinas De Arranque Rendidora'),
(5,'Servilletas A Granel X Menor X Mayor'),
(6,'Vasos Plasticos Blancos'),
(7,'Bolsas De Residuos'),
(8,'Bolsas Para Horno'),
(9,'Precintos'),
(10,'Bandas Elasticas  X Menor X Mayor'),
(11,'Carteles/Estallidos'),
(12,'Moldes De Papel P/Pan Dulce'),
(13,'Rollos Registradora(Obra)  X Menor X Mayor'),
(14,'Bandejas De Carton ( Gris)'),
(15,'Carton Corrugado'),
(16,'Platos Descartables X Menor X Mayor'),
(17,'Platos Y Bandejas  Doradas'),
(18,'Cajas De Pizza Y Emp /Estandar/'),
(19,'Laminas Para Fiambres'),
(20,'Etiquetas (Motex)'),
(21,'Bandejas De Carton  ( Blanca )'),
(22,'Aluminio  /  Bandejas'),
(23,'Tripode'),
(24,'Potes Termicos Para Alimento'),
(25,'Vasos Termicos  (Dart) X Menor X Mayor'),
(26,'Bolsas De Fantasia/Ri�On'),
(27,'Torteras Plasticas C/Tapas X Menor X Mayor'),
(28,'Rollos De P.V.C'),
(29,'Bolsas Camisetas (Reforzadas)'),
(30,'Cinta De Papel'),
(31,'Hilos Y Cintas'),
(32,'Platos Termicos'),
(33,'Cintas Adhesivas  X Menor X Mayor'),
(34,'Sobres De Papel Fantasia'),
(35,'Bolsas De Papel Sulfito/Kraft'),
(36,'Cubiertos Plasticos'),
(37,'Sorbetes'),
(38,'Film Strech'),
(39,'Rollos Registradora (Termico)'),
(40,'Bandejas De Carton Redondas'),
(41,'Bolsas De Consorcio  X Menor X Mayor'),
(42,'Papeles/ Bobina/Resmas'),
(43,'Porta Cintas-Hilo-Dispenser'),
(44,'Bolsas De Polipropileno'),
(45,'Bolsas Camisetas (Economicas)'),
(46,'Cajas De Pizzas Y Empanadas M/M'),
(47,'Talonarios  Duplicados'),
(48,'Portapancho/Cucurucho'),
(49,'Tapsa Para Vasos Termicos'),
(50,'Blondas De Papel Caladas'),
(51,'Resmas De Papel P/Fotocopias'),
(52,'Varios'),
(53,'Guantes Descartables'),
(54,'Potes Termicos Para Helado'),
(55,'Cajas De Carton Corrugado'),
(56,'Bandejas Plasticas P/ Microondas'),
(57,'Potes Bisagra Rotlen X Menor X Mayor'),
(58,'Cajas De Pizzas Y Empanadas B/M'),
(59,'Bandejas De Expandido'),
(60,'Bandejas Plasticas Comunes'),
(61,'Bombonera De Carton'),
(62,'Bobinas De Arranque'),
(63,'Papel Higienico/Rollo De Cocina'),
(64,'Cajas De Pizzas Y Ravioles'),
(65,'Pirotines'),
(66,'Fundas Para Ropa De P.P X Menor X Mayor'),
(67,'Moños');

INSERT INTO packaging (id,name) VALUES 
(1,'Bolsa'),
(2,'Cinta'),
(3,'Pote'),
(4,'Talon'),
(5,'C/U'),
(6,'Plato'),
(7,'Fajas'),
(8,'Rollo'),
(9,'Bobina'),
(10,'Caja'),
(11,'Kilo'),
(12,'Bombonera'),
(13,'Paquete');



INSERT INTO products (id,category_id,packaging_id,description,units,wholesale,retail) VALUES 
(1,22,13,'Bandeja F 75',100,912.0,125.0),
(2,22,13,'Plato P 21',100,367.0,133.0),
(3,22,13,'Bandeja F 50',100,768.0,105.0),
(4,22,13,'Cenicero De Aluminio',100,161.0,35.0),
(5,22,13,'Tapa P/Flanera H 10',100,600.0,43.0),
(6,22,13,'Budineras  1  Kilo',100,448.0,243.0),
(7,22,13,'Budineras 1/2 Kilo',100,931.0,126.0),
(8,22,13,'Plato P 33',100,480.0,347.0),
(9,22,13,'Plato P 29',100,371.0,268.0),
(10,22,13,'Plato P 26',100,533.0,192.0),
(11,22,13,'Plato P 23',100,472.0,170.0),
(12,22,13,'Bandeja F 200',100,616.0,350.0),
(13,22,13,'Tapa P/F 50',100,201.0,55.0),
(14,22,13,'Tapa P/F 75',100,250.0,65.0),
(15,22,13,'Tapa P/F 100',100,277.0,100.0),
(16,22,13,'Tapa P/F 200',100,219.0,160.0),
(17,22,13,'Plato P 14',100,893.0,120.0),
(18,22,13,'Plato P 17',100,864.0,104.0),
(19,22,13,'Plato P 20',100,669.0,120.0),
(20,22,13,'Bandeja F 100',100,439.0,160.0),
(21,10,1,'Bolsa X 1000 Grs',1,576.0,65.0),
(22,10,1,'Bolsa X 500 Grs',1,300.0,33.0),
(23,10,1,'Bolsa X 100 Grs',1,80.0,10.0),
(24,21,13,'Bandeja  N� 3',100,453.0,42.0),
(25,21,13,'Bandeja  N� 5',100,469.0,58.0),
(26,21,13,'Bandeja  N� 4',100,529.0,49.0),
(27,21,13,'Bandeja  N� 2',100,378.0,28.0),
(28,21,13,'Bandeja  N� 1',100,414.0,23.0),
(29,21,13,'Bandeja  N� 8',100,314.0,87.0),
(30,21,13,'Bandeja  N� 7',100,277.0,77.0),
(31,21,13,'Bandeja  N� 6',100,223.0,62.0),
(32,14,13,'Bandeja  N� 1',100,306.0,17.0),
(33,14,13,'Bandeja  N� 8',100,464.0,86.0),
(34,14,13,'Bandeja  N� 7',100,367.0,68.0),
(35,14,13,'Bandeja  N� 6',100,259.0,48.0),
(36,14,13,'Bandeja  N� 5',100,336.0,42.0),
(37,14,13,'Bandeja  N� 4',100,400.0,37.0),
(38,14,13,'Bandeja  N� 3',100,302.0,28.0),
(39,14,13,'Bandeja  N� 2',100,297.0,22.0),
(40,40,13,'Bandeja  N� 14',100,295.0,82.0),
(41,40,13,'Bandeja  N� 16',100,353.0,98.0),
(42,40,13,'Bandeja  N� 12',100,315.0,35.0),
(43,40,13,'"Bandeja  N� 12,5"',100,378.0,42.0),
(44,40,13,'Bandeja  N� 13',100,360.0,50.0),
(45,40,13,'"Bandeja  N� 13,5"',100,313.0,58.0),
(46,40,13,'Bandeja  N� 15',100,342.0,95.0),
(47,59,13,'Bandeja N� 619',100,211.0,58.0),
(48,59,13,'Bandeja N� 628( Redonda)',100,212.0,115.0),
(49,59,13,'Bandeja N� 625',100,192.0,105.0),
(50,59,13,'Bandeja N� 615',100,211.0,58.0),
(51,59,13,'Bandeja N� 621',100,132.0,37.0),
(52,59,13,'Bandeja N� 617',100,110.0,30.0),
(53,59,13,'Bandeja N� 618',100,160.0,43.0),
(54,59,13,'Oblea  N� 618',100,237.0,43.0),
(55,59,13,'Oblea  N� 619',100,211.0,58.0),
(56,60,13,'Bandeja  107  Comun',100,468.0,145.0),
(57,60,13,'Bandeja  103  Comun',100,360.0,55.0),
(58,60,13,'Bandeja  102  Comun',100,252.0,39.0),
(59,60,13,'Bandeja  101  Comun',100,180.0,28.0),
(60,60,13,'Bandeja  105  Comun',100,270.0,82.0),
(61,56,13,'Bandeja 101  Micro',100,252.0,39.0),
(62,56,13,'Bandeja 102  Micro',100,396.0,60.0),
(63,56,13,'Bandeja 107  Micro',100,417.0,175.0),
(64,56,13,'Bandeja 105  Micro',100,396.0,120.0),
(65,56,13,'Bandeja 103  Micro',100,576.0,88.0),
(66,50,13,'Diametro 21  Cms',100,30.0,33.0),
(67,50,13,'Rectangulares 35 X 45 Cms',100,82.0,93.0),
(68,50,13,'Rectangulares 31 X 38 Cms',100,59.0,65.0),
(69,50,13,'Rectangulares 26 X 32 Cms',100,36.0,40.0),
(70,50,13,'Rectangulares 21 X 27 Cms',100,31.0,34.0),
(71,50,13,'Rectangulares 18 X 25 Cms',100,27.0,30.0),
(72,50,13,'Diametro 38  Cms',100,51.0,57.0),
(73,50,13,'Diametro 25  Cms',100,32.0,35.0),
(74,50,13,'Diametro 28  Cms',100,35.0,39.0),
(75,50,13,'Diametro 32  Cms',100,41.0,46.0),
(76,50,13,'Diametro 30  Cms',100,37.0,41.0),
(77,50,13,'Diametro 9  Cms',100,6.0,7.0),
(78,50,13,'Diametro 12  Cms',100,11.0,12.0),
(79,50,13,'Diametro 15  Cms',100,14.0,16.0),
(80,50,13,'Diametro 18  Cms',100,18.0,20.0),
(81,62,8,'40x50x1500grs',1,298.0,54.0),
(82,62,8,'20x30x1500grs',1,298.0,54.0),
(83,62,8,'25x35x1500grs',1,298.0,54.0),
(84,62,8,'30x40x1500grs',1,298.0,54.0),
(85,62,8,'50x70x1500grs',1,298.0,54.0),
(86,62,8,'45x60x1500grs',1,298.0,54.0),
(87,62,8,'35x45x1500grs',1,298.0,54.0),
(88,4,8,'20x30x500 Bolsas',1,345.0,32.0),
(89,4,8,'15x20x500 Bolsas',1,216.0,20.0),
(90,4,8,'15x25x500 Bolsas',1,239.0,22.0),
(91,4,8,'40x50x250 Bolsas',1,243.0,45.0),
(92,4,8,'35x45x250 Bolsas',1,216.0,40.0),
(93,4,8,'30x40x500 Bolsas',1,281.0,52.0),
(94,4,8,'25x35x500 Bolsas',1,324.0,40.0),
(95,45,13,'40x50 (Color)  Tiburon',100,180.0,10.0),
(96,45,13,'20x30  Blanca',100,250.0,7.0),
(97,45,13,'60x80  Blanca',100,203.0,45.0),
(98,45,13,'30x40 (Color)  Tiburon',100,105.0,8.0),
(99,45,13,'50x70 (Color)',100,351.0,26.0),
(100,45,13,'40x50 (Color)  Reforzada',100,200.0,11.0),
(101,45,13,'45x60 (Color)',100,342.0,19.0),
(102,45,13,'50x60 (Color)',100,432.0,24.0),
(103,45,13,'30x40  Blanca',100,144.0,8.0),
(104,29,13,'60x80 (Reforzada) Blanca',100,495.0,55.0),
(105,29,13,'45x60 (Reforzada) Blanca',100,324.0,24.0),
(106,29,13,'50x70 (Reforzada) Blanca',100,405.0,30.0),
(107,29,13,'20x30 (Reforzada) Blanca',100,350.0,8.0),
(108,29,13,'30x40 (Reforzada)  Blanca',100,165.0,10.0),
(109,29,13,'40x50 (Reforzada) Blanca',100,265.0,15.0),
(110,29,13,'50x60 (Reforzada) Blanca',100,516.0,28.0),
(111,41,13,'80x110cms X 10',10,216.0,12.0),
(112,41,13,'60x90  Cms X 50 Reforzada',50,650.0,70.0),
(113,41,13,'80x110cms X 50 Reforzada',50,960.0,140.0),
(114,41,13,'60x90  Cms X 10',10,240.0,8.0),
(115,41,13,'90x120cms X 10',10,336.0,18.0),
(116,26,13,'40 X 50 Cms B/Ri�On',50,60.0,67.0),
(117,26,13,'17 X 25 Cms B/Ri�On',100,36.0,40.0),
(118,26,13,'50 X 60 Cms B/Ri�On',50,99.0,110.0),
(119,26,13,'35 X 45 Cms B/Ri�On',50,51.0,54.0),
(120,26,13,'30 X 40 Cms B/Ri�On',50,36.0,39.0),
(121,26,13,'25 X 35 Cms B/Ri�On',50,27.0,30.0),
(122,26,13,'20 X 30 Cms B/Ri�On',50,22.0,25.0),
(123,35,13,'Bolsa  N� 6l',100,450.0,25.0),
(124,35,13,'Bolsa  N� 1',100,198.0,11.0),
(125,35,13,'Bolsa  N� 1l',100,216.0,12.0),
(126,35,13,'Bolsa  N� 2',100,234.0,13.0),
(127,35,13,'Bolsa  N� 2l',100,252.0,14.0),
(128,35,13,'Bolsa  N� 3',100,252.0,14.0),
(129,35,13,'Bolsa  N� 3l',100,270.0,15.0),
(130,35,13,'Bolsa  N� 4',100,306.0,17.0),
(131,35,13,'Bolsa  N� 4a',100,324.0,18.0),
(132,35,13,'Bolsa  N� 5',100,378.0,21.0),
(133,35,13,'Bolsa  N� 8',100,324.0,36.0),
(134,35,13,'Bolsa  N� 7',100,270.0,30.0),
(135,35,13,'Bolsa  N� 6',100,414.0,23.0),
(136,44,13,'Bolsa Pp 15 X 20 Cms.',100,90.0,10.0),
(137,44,13,'Bolsa Pp 12 X 35 Cms.',100,117.0,13.0),
(138,44,13,'Bolsa Pp 12 X 30 Cms.',100,100.0,11.0),
(139,44,13,'Bolsa Pp 10 X 30 Cms.',100,90.0,10.0),
(140,44,13,'Bolsa Pp 20 X 40 Cms.',100,216.0,24.0),
(141,44,13,'Bolsa Pp 20 X 35 Cms.',100,191.0,21.0),
(142,44,13,'Bolsa Pp 20 X 30 Cms.',100,134.0,16.0),
(143,44,13,'Bolsa Pp 20 X 25 Cms.',100,135.0,15.0),
(144,44,13,'Bolsa Pp 20 X 20 Cms.',100,113.0,12.5),
(145,44,13,'Bolsa Pp 17 X 25 Cms.',100,126.0,14.0),
(146,44,13,'Bolsa Pp 15 X 45 Cms.',100,191.0,21.0),
(147,44,13,'Bolsa Pp 15 X 40 Cms.',100,162.0,18.0),
(148,44,13,'Bolsa Pp 15 X 35 Cms.',100,153.0,17.0),
(149,44,13,'Bolsa Pp 15 X 30 Cms.',100,117.0,13.0),
(150,44,13,'Bolsa Pp 15 X 25 Cms.',100,104.0,11.5),
(151,44,13,'Bolsa Pp 12 X 25 Cms.',100,90.0,10.0),
(152,44,13,'Bolsa Pp 12 X 20 Cms.',100,77.0,8.5),
(153,44,13,'Bolsa Pp 12 X 15 Cms.',100,63.0,7.0),
(154,44,13,'Bolsa Pp 10 X 25 Cms.',100,77.0,8.5),
(155,44,13,'Bolsa Pp 10 X 20 Cms.',100,63.0,7.0),
(156,44,13,'Bolsa Pp 10 X 15 Cms.',100,55.0,6.0),
(157,44,13,'Bolsa Pp  8 X 30 Cms.',100,81.0,9.0),
(158,44,13,'Bolsa Pp  8 X 25 Cms.',100,67.0,7.5),
(159,44,13,'Bolsa Pp  8 X 20 Cms.',100,63.0,7.0),
(160,44,13,'Bolsa Pp  8 X 15 Cms.',100,50.0,5.5),
(161,44,13,'Bolsa Pp  8 X 12 Cms.',100,45.0,5.0),
(162,44,13,'Bolsa Pp  8 X 10 Cms.',100,45.0,5.0),
(163,44,13,'Bolsa Pp  6 X 30 Cms.',100,63.0,7.0),
(164,44,13,'Bolsa Pp  6 X 25 Cms.',100,55.0,6.0),
(165,44,13,'Bolsa Pp  6 X 20 Cms.',100,50.0,5.5),
(166,44,13,'Bolsa Pp  6 X 15 Cms.',100,45.0,5.0),
(167,44,13,'Bolsa Pp  5 X 30 Cms.',100,55.0,6.0),
(168,44,13,'Bolsa Pp  5 X 25 Cms.',100,50.0,5.5),
(169,44,13,'Bolsa Pp  5 X 20 Cms.',100,45.0,5.0),
(170,44,13,'Bolsa Pp 50 X 70 Cms.',100,990.0,145.0),
(171,44,13,'Bolsa Pp 50 X 60 Cms.',100,743.0,86.0),
(172,44,13,'Bolsa Pp 45 X 60 Cms.',100,762.0,82.0),
(173,44,13,'Bolsa Pp 40 X 60 Cms.',100,648.0,72.0),
(174,44,13,'Bolsa Pp 40 X 50 Cms.',100,477.0,53.0),
(175,44,13,'Bolsa Pp 35 X 50 Cms.',100,387.0,43.0),
(176,44,13,'Bolsa Pp 35 X 45 Cms.',100,350.0,39.0),
(177,44,13,'Bolsa Pp 35 X 40 Cms.',100,340.0,38.0),
(178,44,13,'Bolsa Pp 30 X 45 Cms.',100,350.0,39.0),
(179,44,13,'Bolsa Pp 30 X 40 Cms.',100,270.0,31.0),
(180,44,13,'Bolsa Pp 30 X 35 Cms.',100,270.0,31.0),
(181,44,13,'Bolsa Pp 25 X 40 Cms.',100,260.0,29.0),
(182,44,13,'Bolsa Pp 25 X 35 Cms.',100,216.0,24.0),
(183,44,13,'Bolsa Pp 25 X 30 Cms.',100,191.0,21.0),
(184,44,13,'Bolsa Pp 22 X 40 Cms.',100,225.0,25.0),
(185,44,13,'Bolsa Pp 22 X 35 Cms.',100,198.0,22.0),
(186,44,13,'Bolsa Pp 22 X 30 Cms.',100,171.0,19.0),
(187,7,13,'50x70 X 10',10,320.0,5.0),
(188,7,8,'45x60 X160 Aprox / Reforzada (Rollo)',1,120.0,125.0),
(189,7,8,'50x70 X170 Aprox/ Reforzada  (Rollo)',1,120.0,125.0),
(190,7,13,'45x60 X 10',10,260.0,3.0),
(191,8,13,'Freez-Orm 45x30x10',10,312.0,15.0),
(192,61,12,'Bombonera  1/4 Kg',1,225.0,5.0),
(193,61,12,'Bombonera  1 Kg',1,126.0,7.0),
(194,61,12,'Bombonera  1/2 Kg',1,216.0,6.0),
(195,55,10,'P/ Armar 35 X 25 X 25',1,157.0,7.0),
(196,55,10,'P/ Armar Navide�As',1,225.0,10.0),
(197,55,10,'P/ Armar 20 X 20 X 20',1,113.0,5.0),
(198,55,10,'P/ Armar 60 X 40 X 40',1,288.0,16.0),
(199,55,10,'P/ Armar 40 X 30 X 30',1,202.0,9.0),
(200,55,10,'P/ Armar 50 X 40 X 30',1,270.0,12.0),
(201,55,10,'P/ Armar 30 X 20 X 20',1,135.0,6.0),
(202,18,13,'Micro  M/M Gr  Estandar  (1 Color)',100,220.0,230.0),
(203,18,13,'Micro  M/M Emp X 18  Est  (1 Color)',100,220.0,230.0),
(204,18,13,'Micro  M/M Emp X 12  Est  (1 Color)',100,220.0,230.0),
(205,18,13,'Micro  M/M Ch  Estandar  (1 Color)',100,210.0,220.0),
(206,58,13,'Micro  B/M  Grande (Lisa)',100,325.0,335.0),
(207,58,13,'Micro  B/M  Emp X 18  (Lisa)',100,320.0,330.0),
(208,58,13,'Micro  B/M  Emp X 12  (Lisa)',100,320.0,330.0),
(209,58,13,'Micro  B/M  Chica  (Lisa)',100,320.0,330.0),
(210,46,13,'Micro  M/M Grande  (Lisas)',100,200.0,210.0),
(211,46,13,'Micro  M/M Emp X 18 (Lisas)',100,200.0,210.0),
(212,46,13,'Micro  M/M Emp X 12 (Lisas)',100,200.0,210.0),
(213,46,13,'Micro  M/M Chica (Lisas)',100,195.0,205.0),
(214,46,13,'Micro  M/M Grande  (Lisas)Economica',100,180.0,190.0),
(215,64,13,'Gris Grande Comun N�50',100,95.0,105.0),
(216,64,13,'Cajas Para Ravioles Comun',100,100.0,110.0),
(217,64,13,'Gris Grande  Super  N�40',100,110.0,122.0),
(218,64,13,'Gris Grande Reforzada N�45',100,105.0,115.0),
(219,64,13,'Cajas Para Ravioles Reforzada',100,120.0,130.0),
(220,11,13,'Estallidos 27 X 36',20,81.0,90.0),
(221,11,13,'Estallidos 7 X 9',20,6.0,7.0),
(222,11,13,'"Estallidos 4,5x6"',20,4.0,5.0),
(223,11,13,'Estallidos 3 X 4',20,4.0,5.0),
(224,11,7,'Fajas Aut.Varios Motivos Chicos',1,7.0,8.0),
(225,11,7,'Fajas Aut.Varios Motivos Grandes',1,14.0,16.0),
(226,11,13,'Estallidos 13 X 18',20,16.0,18.0),
(227,11,13,'Estallidos 15 X 20',20,18.0,20.0),
(228,11,13,'Estallidos 10 X 12',20,13.0,15.0),
(229,11,13,'"Estallidos 9 X 11,5"',20,11.0,12.0),
(230,11,13,'"Estallidos 7 X 9,5"',20,6.0,7.0),
(231,15,8,'Rollo 100 Cms  X 25/30 Metros',1,56.0,62.0),
(232,15,8,'Rollo 90 Cms  X 25/30 Metros',1,51.0,56.0),
(233,15,8,'Rollo 120 Cms  X 25/30 Metros',1,61.0,68.0),
(234,15,8,'Rollo 140 Cms  X 25/30 Metros',1,66.0,74.0),
(235,15,8,'Rollo 80 Cms  X 25/30 Metros',1,44.0,49.0),
(236,30,2,'24 X 50 Cm  (Rapifix)',1,648.0,20.0),
(237,30,2,'36 X 50 Cm  (Rapifix)',1,626.0,29.0),
(238,30,2,'48 X 50 Cm  (Rapifix)',1,665.0,37.0),
(239,30,2,'12 X 50 Cm  (Rapifix)',1,792.0,10.0),
(240,30,2,'18 X 50 Cm  (Rapifix)',1,648.0,15.0),
(241,33,2,'48 X 50 Transparente',1,324.0,10.0),
(242,33,2,'48 X 50 Marron',1,324.0,10.0),
(243,33,2,'12 X 30 Transparente',1,907.0,3.5),
(244,33,2,'24 X 50 Transparente',1,453.0,7.0),
(245,36,11,'Cucharas P/Helado Pala Virgen',1,440.0,50.0),
(246,36,10,'Cucharas  Sopera  Virgen',1000,175.0,195.0),
(247,36,10,'Cucharas Sundae  Comun',1000,100.0,110.0),
(248,36,1,'Pinches P/Copetin (Espaditas)',1000,202.0,45.0),
(249,36,1,'Agitadores P/Trago Largo Cristal',100,225.0,25.0),
(250,36,1,'Agitadores P/Caf� Cristal',1000,320.0,35.0),
(251,36,11,'Cucharas P/Helado Pala Comun',1,320.0,35.0),
(252,36,10,'Cucharas Sundae  Virgen',1000,120.0,130.0),
(253,36,10,'Tenedores Plasticos Virgen',1000,172.0,190.0),
(254,36,10,'Cuchillos Plasticos Virgen',1000,172.0,190.0),
(255,33,2,'48 X 100 Marron',1,0.0,16.0),
(256,2,10,'Tapas P/Ensaladeras (650cc)',100,138.0,154.0),
(257,2,10,'Ensaladera P/ Grande (850cc)C/Tapa',100,298.0,332.0),
(258,2,10,'Ensaladera P/ Mediana (650cc)',100,145.0,162.0),
(259,20,10,'Motex  Blanco',1,4.0,5.0),
(260,20,10,'"Motex  (Amarillo,Verde,Naranja)"',1,5.0,6.5),
(261,38,8,'Rollo  10 Cms.  (Virgen)',1,13.0,15.0),
(262,38,8,'Rollo  50 Cms. S/Mango',1,26.0,28.5),
(263,38,8,'Rollo  50 Cms. C/Mango',1,26.0,28.5),
(264,66,13,'50 X 80 Cms',100,157.0,175.0),
(265,66,13,'45 X 70 Cms',100,135.0,150.0),
(266,66,13,'60 X 90 Cms',100,225.0,248.0),
(267,53,10,'"Guantes De Latex (S),(M),(L)"',100,75.0,80.0),
(268,53,13,'Guantes Plasticos X100',100,940.0,15.0),
(269,31,13,'Hilo De Formio (Sisal) X 30 Mts',10,800.0,89.0),
(270,31,13,'Hilo Choricero En Ovillo X 50 Grs',10,65.0,8.0),
(271,31,13,'Hilo Choricero En Bobina X Kilo',1,190.0,21.0),
(272,31,13,'Hilo Algod�N En  Ovillos X 50 Grs',10,35.0,4.0),
(273,31,9,'Hilo  Algod�N En Bobina 3 Herbas',1,135.0,15.0),
(274,31,13,'Hilo Cinta X 1.500gr/Aprox',1,214.0,39.0),
(275,31,13,'Hilo Recuperado 400 Grs',1,255.0,19.0),
(276,19,11,'20x25 Cms',1,365.0,42.0),
(277,19,11,'25x37 Cms',1,365.0,42.0),
(278,19,11,'37x50 Cms',1,365.0,42.0),
(279,19,11,'13x26 Cms P/Hamburguesa (Doble)',1,384.0,42.0),
(280,19,11,'20x25 Cms Comun',1,336.0,40.0),
(281,12,13,'P/Budin Con Aleta X 40',100,837.0,93.0),
(282,12,13,'P/Pan Dulce X 100 Grs',100,495.0,55.0),
(283,12,13,'P/Pan Dulce X 250 Grs',100,558.0,62.0),
(284,12,13,'P/Pan Dulce X 500 Grs',100,675.0,75.0),
(285,12,13,'P/Pan Dulce X 700 Grs',100,765.0,85.0),
(286,12,13,'P/Pan Dulce X 1000grs',100,810.0,90.0),
(287,12,13,'P/Bizcochuelo N� 20x50',100,145.0,161.0),
(288,12,13,'P/Bizcochuelo N� 22x50',100,155.0,172.0),
(289,12,13,'P/Rosca N�20x50',100,165.0,183.0),
(290,12,13,'P/Rosca N�22x50',100,178.0,197.0),
(291,67,13,'N�2 Magico P/Armar',100,34.0,38.0),
(292,67,13,'N�1 Magico P/Armar',100,24.0,27.0),
(293,67,13,'N�0 Magico P/Armar',100,20.0,22.0),
(294,63,13,'300 Mts  P/Expendedor',4,76.0,84.0),
(295,63,13,'Roolo De Cocina Elegante X 50 P',3,90.0,100.0),
(296,63,13,'30 Mts X 4 Gris Comun',4,90.0,100.0),
(297,63,13,'30 Mts X 4 Blanco Elegante',4,117.0,130.0),
(298,63,13,'Rollo De Cocina Dicha X 50 P',3,82.0,88.0),
(299,42,11,'Papel Diario En Bobina 60 Cms',1,148.0,16.0),
(300,42,11,'Papel Diario En Hojas 40 X 50',1,148.0,16.0),
(301,42,11,'Papel Diario En Hojas 30 X 40',1,148.0,16.0),
(302,42,11,'Papel Diario En Hojas 35 X 45',1,148.0,16.0),
(303,42,11,'Bobina Fantasia  40 Cms',1,26.0,29.0),
(304,42,11,'Papel Diario En Hojas 45 X 60',1,148.0,16.0),
(305,42,11,'Papel Diario En Hojas 50 X 70',1,148.0,16.0),
(306,42,11,'Papel Diario En Hojas 64 X 90',1,148.0,16.0),
(307,42,11,'Papel Diario En Bobina 40 Cms',1,148.0,16.0),
(308,42,11,'Fondo Raviolero Satinado',1,170.0,18.0),
(309,42,11,'Fondo Pizzero Satinado 25 X 25 (Ch)',1,170.0,18.0),
(310,42,11,'Fondo Pizzero Satinado 31 X 31 (Gr)',1,170.0,18.0),
(311,42,11,'Fondo Pizzero Comun 25 X 25',1,148.0,16.0),
(312,42,11,'Fondo Pizzero Comun 31 X 31',1,148.0,16.0),
(313,42,11,'Bobina Panedaria/Pizzeria 60 Cms',1,26.0,29.0),
(314,42,11,'Bobina Panedaria/Pizzeria 40 Cms',1,26.0,29.0),
(315,42,11,'Kraft En Bobina 60 Cms (50/80grs)',1,17.0,18.5),
(316,42,11,'Kraft En Bobina 40 Cms (50/80grs)',1,17.0,18.5),
(317,42,11,'Bobina Linea Dorada 60 Cms',1,36.0,39.0),
(318,42,11,'Bobina Linea Dorada 40 Cms',1,36.0,39.0),
(319,42,11,'Bobina Fantasia  60 Cms',1,26.0,29.0),
(320,65,10,'Pirot.N�10',1000,81.0,90.0),
(321,65,10,'Pirot.N�10l',1000,61.0,67.0),
(322,65,10,'Pirot.N�11',1000,83.0,93.0),
(323,65,10,'Pirot.N�3',1000,22.0,25.0),
(324,65,10,'Pirot.N�4',1000,24.0,27.0),
(325,65,10,'Pirot.N�5',1000,30.0,33.0),
(326,65,10,'Pirot.N�6',1000,33.0,37.0),
(327,65,10,'Pirot.N�7',1000,39.0,43.0),
(328,65,10,'Pirot.N�8',1000,47.0,52.0),
(329,65,10,'Pirot.N�9',1000,49.0,54.0),
(330,16,13,'Plato 17 Cms Blanco Ban-Plast',50,25.0,28.0),
(331,16,13,'Octogonal Plastico 17 Cms',100,219.0,243.0),
(332,16,13,'Octogonal Plastico 22 Cms',100,329.0,365.0),
(333,16,13,'Plato 17 Cms Blanco Economico',50,20.0,22.0),
(334,16,13,'Plato 22 Cms Blanco Economico',50,33.0,37.0),
(335,16,13,'Plato 22 Cms Blanco Ban-Plast',50,55.0,50.0),
(336,32,6,'N�34  X  1000ml  C/Tapa (Isopor)',100,326.0,3.5),
(337,32,6,'X 1000ml C/Tapa (Bandex)',100,978.0,3.5),
(338,17,13,'Plato 24 Cms',50,157.0,3.5),
(339,17,13,'Bandeja  1/4 Kilo',100,180.0,2.0),
(340,17,13,'Bandeja  1/2 Kilo',50,112.0,2.5),
(341,17,13,'Bandeja  3/4 Kilo',50,135.0,3.0),
(342,17,13,'Plato 34 Cms',50,270.0,6.0),
(343,17,13,'Plato 31 Cms',50,225.0,5.0),
(344,17,13,'Plato 28 Cms',50,202.0,4.5),
(345,17,13,'Plato 26 Cms',50,180.0,4.0),
(346,17,13,'Bandeja  1 Kilo',50,157.0,3.5),
(347,17,13,'Bandeja 1 1/2 Kilo',50,180.0,4.0),
(348,17,13,'Bandeja  2 Kilo',50,225.0,5.0),
(349,17,13,'Bandeja 2 1/2 Kilo',50,270.0,6.0),
(350,17,13,'Bandeja  3 Kilo',50,315.0,7.0),
(351,17,13,'Plato 22 Cms',50,135.0,3.0),
(352,43,5,'Porta Cinta 30cm (Chico)',1,31.0,35.0),
(353,43,5,'Porta Rollo Turno',1,76.0,84.0),
(354,43,5,'Porta Hilo',1,113.0,126.0),
(355,43,5,'Porta Cinta 60cm (Grande)',1,40.0,45.0),
(356,43,5,'Portabobinas  40cm',1,122.0,136.0),
(357,43,5,'Portabobinas  60cm',1,138.0,153.0),
(358,43,5,'Portabobinas 40/60cm  (Combinada)',1,183.0,203.0),
(359,43,5,'Racionador De Cinta Embalar (Gr)',1,110.0,122.0),
(360,43,5,'Racionador De Cinta Embalar (Ch)',1,65.0,73.0),
(361,43,5,'Porta Rollo Film Pvc',1,249.0,282.0),
(362,43,5,'Dispenser Limpia Manos (Pie)',1,202.0,224.0),
(363,43,5,'Dispenser Limpia Manos (Pared)',1,148.0,164.0),
(364,43,5,'Dispenser Toallero',1,98.0,108.0),
(365,43,5,'Dispenser Higienico',1,95.0,105.0),
(366,43,5,'Dispenser Jabonera (Pared)',1,103.0,115.0),
(367,43,5,'Etiqueteadora (Jolly) 8 Digitos',1,370.0,410.0),
(368,48,13,'Portapancho Gris',100,50.0,11.0),
(369,48,13,'Cucurucho Papa Frita',100,67.0,25.0),
(370,57,3,'Pote Bisagra (3042)  250cc',100,720.0,1.0),
(371,57,3,'Pote Bisagra (3071)  750cc',100,864.0,1.2),
(372,57,3,'Pote Bisagra (3050)  500cc',100,746.0,1.1),
(373,24,13,'Pote 360 Cc',100,312.0,0.75),
(374,24,13,'Pote 120 Cc',100,255.0,0.3),
(375,24,13,'Pote 180 Cc',100,314.0,0.4),
(376,24,13,'Pote 240 Cc',100,412.0,0.5),
(377,54,13,'Pote 1/2 Kilo',20,288.0,3.2),
(378,54,13,'Pote 1  Kilo',20,387.0,4.3),
(379,54,13,'Pote 1/4 Kilo',20,180.0,2.0),
(380,3,3,'Tapas Para (150/250/500cc)',100,405.0,45.0),
(381,3,3,'Pote Natural 500cc',100,972.0,108.0),
(382,3,3,'Pote Natural 250cc',100,648.0,72.0),
(383,3,3,'Pote Natural 150cc',100,603.0,67.0),
(384,9,13,'Precintos  Plast. 9 Cm',1000,540.0,12.0),
(385,9,13,'Precintos  Plast. 6 Cm',1000,405.0,9.0),
(386,51,13,'Resma A4  75gr  (Autor)',500,531.0,59.0),
(387,51,13,'Oficio  75gr  (Autor)',500,621.0,69.0),
(388,51,13,'Oficio  70gr  (Autor)',500,585.0,65.0),
(389,51,13,'Resma A4  80gr  (Autor)',500,585.0,65.0),
(390,51,13,'Resma A4  70gr  (Autor)',500,583.0,54.0),
(391,28,8,'Film  38 X 300 Mts',1,624.0,44.0),
(392,28,8,'Aluminio 30 X 5 Mts',1,180.0,8.0),
(393,28,8,'Manteca 30 X 5 Mts Rollo',1,240.0,8.0),
(394,28,8,'Film  45 X 300 Mts',1,880.0,55.0),
(395,28,8,'Film  30 X 300 Mts',1,468.0,33.5),
(396,28,8,'Film  30 X 30 Mts',1,180.0,8.0),
(397,28,8,'Film  45 X 800 Mts',1,202.0,225.0),
(398,28,8,'Film  38 X 800 Mts',1,180.0,200.0),
(399,28,8,'Film  30 X 800 Mts',1,145.0,160.0),
(400,39,13,'44 Mm X 50 Mts. Termico',10,675.0,75.0),
(401,39,13,'57 Mm X 30 Mts. Termico',10,540.0,60.0),
(402,39,13,'76 Mm X 30 Mts. Quimico',10,513.0,114.0),
(403,13,13,'37mm X 50mts. Obra',10,360.0,40.0),
(404,13,13,'44mm X 50mts. Obra',10,450.0,50.0),
(405,13,13,'76mm X 30mts. Obra',10,227.0,52.0),
(406,13,13,'57mm X 30mts. Obra',10,315.0,35.0),
(407,5,8,'Limpia Manos 25cm X 400mt Elegante',1,99.0,110.0),
(408,5,10,'Toallas Intercaladas (4pliegos)',2400,126.0,140.0),
(409,5,10,'T/Bar X 10.000 Economica',10000,85.0,95.0),
(410,5,10,'18 X 18 Cms X 2000 Economica',2000,51.0,56.0),
(411,5,10,'24 X 24 Cms   Economica',2000,67.0,75.0),
(412,5,10,'33 X 33 X 1000   Elegante',1000,74.0,82.0),
(413,5,8,'Limpia Manos 20cm X 400mt Elegante',1,86.0,95.0),
(414,34,13,'Sobre 15 X 25 Cms',100,486.0,54.0),
(415,34,13,'Sobre 14 X 21 Cms',100,278.0,42.0),
(416,34,13,'Sobre  8 X 26 Cms',100,270.0,30.0),
(417,34,13,'Sobre  7 X 10 Cms',100,135.0,16.0),
(418,34,13,'Sobre  7 X 20 Cms',100,414.0,23.0),
(419,34,13,'Sobre 25 X 35 Cms',100,504.0,112.0),
(420,34,13,'Sobre 29 X 39 Cms',100,675.0,150.0),
(421,34,13,'Sobre 20 X 29 Cms',100,702.0,78.0),
(422,34,13,'Sobre  9 X 15 Cms',100,180.0,20.0),
(423,37,10,'1000 Ensobrados',1000,47.0,57.0),
(424,37,1,'300 Color Flexible',1,58.0,65.0),
(425,37,1,'600 Sin Ensobrar Negro',1,324.0,45.0),
(426,47,4,'Talon. Chico X 50 Hojas Doble',1,648.0,6.0),
(427,47,4,'Talon. Grande X 50 Hojas Doble',1,792.0,11.0),
(428,49,13,'10jlp/Vaso 300cc',100,232.0,27.0),
(429,49,13,'20jlp/Vaso 360cc',100,344.0,39.0),
(430,49,13,'4jl  P/Vaso 120cc',100,183.0,22.0),
(431,49,13,'6jl  P/Vaso 180cc',100,201.0,24.0),
(432,49,13,'8jl  P/Vaso 240cc',100,218.0,26.0),
(433,27,13,'Tortera N�32  Alta',100,840.0,9.4),
(434,27,13,'Tortera N�28  Baja',100,600.0,7.0),
(435,27,13,'Tortera N�26  Baja',100,480.0,5.5),
(436,27,13,'Tortera N�28  Alta',100,624.0,7.5),
(437,27,13,'Tortera N�32  Baja',100,790.0,8.8),
(438,27,13,'Tortera N�26  Alta',100,504.0,6.0),
(439,23,11,'Tripodes Virgen',1,279.0,31.0),
(440,23,11,'Tripodes Comun',1,192.0,22.0),
(441,52,10,'Escarbadientes A Granel X 3000',3000,130.0,145.0),
(442,52,13,'Servilletero Plastico T/Bar',1,22.0,25.0),
(443,52,13,'"Lanchera V/Colores (Boca,River)"',1,110.0,120.0),
(444,52,8,'Rollos Para Turno X 1000 Numeros',1,54.0,5.0),
(445,52,13,'Tacos 9x9',1,180.0,8.0),
(446,1,13,'Trago Largo (Transparente)',100,225.0,1.0),
(447,1,13,'Champagne Cristal',100,945.0,3.5),
(448,1,13,'Compotera Cristal',100,569.0,1.15),
(449,28,8,'Aluminio 38 X 1 Kilo',1,1476.0,82.0),
(450,52,10,'Rejillas Plasticas',800,1080.0,1.5),
(451,1,13,'Whisky  Cristal',100,468.0,2.0),
(452,1,13,'Sidra Cristal',100,180.0,1.0),
(453,1,13,'"Trago Largo (Azul,Rojo,Amarillo,Verde)"',100,270.0,1.2),
(454,6,13,'Vasos Blancos 180 Cc',100,756.0,28.0),
(455,6,13,'Vasos Blancos 110 Cc',100,912.0,26.0),
(456,6,13,'Vasos Blancos 500 Cc',100,916.0,106.0),
(457,6,13,'Vasos Blancos 330 Cc',100,950.0,44.0),
(458,6,13,'Vasos Blancos 300 Cc',100,907.0,42.0),
(459,6,13,'Vasos Blancos 220 Cc',100,918.0,34.0),
(460,25,13,'Vaso  120 Cc',100,186.0,22.5),
(461,25,13,'Vaso  165 Cc',100,255.0,30.0),
(462,25,13,'Vaso  180 Cc',100,229.0,27.0),
(463,25,13,'Vaso  240 Cc',100,267.0,32.0),
(464,25,13,'Vaso  475 Cc',100,600.0,70.0),
(465,25,13,'Vaso  300 Cc',100,330.0,38.0),
(466,25,13,'Vaso  330 Cc',100,400.0,46.0),
(467,25,13,'Vaso  360 Cc',100,438.0,50.0),
(468,31,5,'Cinta Recuperado (Bob X 2kg)',1,210.0,39.0),
(469,19,11,'13x13 Cms P/Hamburguesa',1,312.0,30.0),
(470,28,8,'Manteca 38 X 50 Mts Rollo',1,1500.0,80.0),
(471,6,13,'Vasos Blancos 70 Cc',100,1235.0,28.0),
(472,44,13,'Bolsa Pp 45 X 70 Cms.',100,1000.0,135.0),
(473,6,13,'Vasos Blancos 800 Cc',100,1010.0,170.0),
(474,6,13,'Vasos Blancos 1000cc',100,1188.0,198.0),
(475,22,13,'Flanera H 7',100,1170.0,85.0),
(476,22,13,'Flanera H 10',100,1170.0,85.0),
(477,33,2,'48 X 100 Transparente',1,1037.0,16.0),
(478,36,10,'Cuchillos Plasticos Comun',1000,0.0,170.0),
(479,36,10,'Tenedores Plasticos Comun',1000,0.0,170.0);

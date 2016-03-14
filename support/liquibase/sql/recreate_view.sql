
drop table products_formats_backup;
create table products_formats_backup as select * from products_formats;

delete from shopping_cart;
delete from products_formats;

CREATE OR REPLACE VIEW plain_info AS
SELECT	pf.id AS pf_id,
		pf.format AS pf_format,
		pf.quantity AS pf_quantity,
		pf.units AS pf_units,
		pf.wholesale AS pf_wholesale,
		pf.retail AS pf_retail,
		p.id AS p_id,
		p.name AS p_name,
		p.url AS p_url,
		p.is_visible AS p_is_visible,
		p.is_offer AS p_is_offer,
		c.id AS c_id,
		c.name AS c_name,
		c.url AS c_url,
		pk.id AS pk_id,
		pk.name AS pk_name
FROM		products p
LEFT JOIN categories c ON p.category_id = c.id 
LEFT JOIN packaging pk ON p.packaging_id = pk.id
LEFT OUTER JOIN products_formats pf ON pf.product_id = p.id; 


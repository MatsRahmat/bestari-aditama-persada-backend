
-- customet address from jakarta
SELECT * FROM Customers WHERE address LIKE '%jakarta';


-- select customer data with status sent

SELECT c.name AS name, c.phone AS phone, o.code AS order_code, o.resi_number AS order_resi,
o.created_at AS order_date, s.code AS ship_code,
s.status AS status, s.created_at AS shipment_status_date 
FROM customers c 
JOIN orders o ON c.id = o."Customer_id" 
JOIN shipments s ON o.id = s."Order_id" WHERE s.status = 'sent';


-- select success dan cancel order pada bulan january sampai april untuk pelanggan dari daerah bekasi

SELECT (SELECT count(c.id) FROM	customers c
	JOIN orders o ON o."Customer_id" = c.id
	JOIN shipments s ON	o.id = s."Order_id" WHERE c.address LIKE '%bekasi' AND (date_part('month', s.created_at) BETWEEN 1 AND 4) AND s.status = 'sent') AS success,
	(SELECT count(c.id) FROM	customers c
	JOIN orders o ON o."Customer_id" = c.id
	JOIN shipments s ON	o.id = s."Order_id" WHERE c.address LIKE '%bekasi' AND (date_part('month', s.created_at) BETWEEN 1 AND 4) AND s.status = 'cancle') AS cancle;

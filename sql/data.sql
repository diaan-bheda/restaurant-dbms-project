USE restaurant_db;

INSERT INTO Customer VALUES
(1,'Rahul','Sharma','9876543210','rahul@gmail.com','400001','A Wing'),
(2,'Priya','Patel','9123456780','priya@gmail.com','400002','B Wing');

INSERT INTO Restaurant VALUES
(101,'Spice Hub','9988776655','Mumbai'),
(102,'Pizza World','8877665544','Mumbai');

INSERT INTO Restaurant_Cuisine VALUES
(101,'Indian'),
(102,'Italian');

INSERT INTO Menu_New VALUES
(1,'Paneer Butter Masala',250,101),
(2,'Margherita Pizza',300,102);

INSERT INTO Orders VALUES
(1001,550,1,NOW()),
(1002,300,2,NOW());

INSERT INTO Order_Items VALUES
(1,1001,1,2),
(2,1002,2,1);

INSERT INTO Payment VALUES
(1,1001,'UPI','Completed',550),
(2,1002,'Card','Pending',300);

INSERT INTO Delivery_Agent VALUES
(1,'Amit','9999999999'),
(2,'Rohit','8888888888');

INSERT INTO Delivery VALUES
(1,1001,1,'Delivered',NOW()),
(2,1002,2,'In Progress',NOW());

INSERT INTO Reservation VALUES
(1,1,101,4,'Dinner',NOW());

INSERT INTO Review VALUES
(1,1,101,1,5,'Excellent');

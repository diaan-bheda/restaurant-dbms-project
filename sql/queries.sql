USE restaurant_db;

-- Query 1: Customer contact information
SELECT First_Name, Last_Name, Phone, Email FROM Customer;

-- Query 2: Transaction made by the customer who placed the order, amount spent, and payment status
SELECT C.First_Name, O.Order_ID, P.Amount, P.Status
FROM Customer C
JOIN Orders O ON C.Customer_ID = O.Customer_ID
JOIN Payment P ON O.Order_ID = P.Order_ID;

-- Query 3: Average rating per restaurant
SELECT R.Restaurant_Name, AVG(Review.Rating) AS Avg_Rating
FROM Review
JOIN Restaurant R ON Review.Restaurant_ID = R.Restaurant_ID
GROUP BY R.Restaurant_Name;

-- Query 4: Total revenue from completed payments
SELECT SUM(Amount) AS Total_Revenue
FROM Payment
WHERE Status = 'Completed';

-- Query 5: View deliveries that have been completed successfully
SELECT * FROM Delivery
WHERE Delivery_Status = 'Delivered';

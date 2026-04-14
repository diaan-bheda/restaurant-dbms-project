CREATE DATABASE restaurant_db;
USE restaurant_db;

CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Phone VARCHAR(15),
    Email VARCHAR(100),
    Pincode VARCHAR(10),
    Tower_Name VARCHAR(100)
);

CREATE TABLE Restaurant (
    Restaurant_ID INT PRIMARY KEY,
    Restaurant_Name VARCHAR(100),
    Restaurant_Phone VARCHAR(15),
    Restaurant_Location VARCHAR(100)
);

CREATE TABLE Restaurant_Cuisine (
    Restaurant_ID INT,
    Cuisine_Type VARCHAR(50),
    PRIMARY KEY (Restaurant_ID),
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurant(Restaurant_ID)
);

CREATE TABLE Menu_New (
    Menu_ID INT PRIMARY KEY,
    Item_Name VARCHAR(100),
    Price DECIMAL(10,2),
    Restaurant_ID INT,
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurant(Restaurant_ID)
);

CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY,
    Total_Amount DECIMAL(10,2),
    Customer_ID INT,
    Order_Timestamp DATETIME,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

CREATE TABLE Order_Items (
    O_ItemID INT PRIMARY KEY,
    Order_ID INT,
    Menu_ID INT,
    Quantity INT,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    FOREIGN KEY (Menu_ID) REFERENCES Menu_New(Menu_ID)
);

CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY,
    Order_ID INT,
    Method VARCHAR(50),
    Status VARCHAR(50),
    Amount DECIMAL(10,2),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
);

CREATE TABLE Delivery_Agent (
    Agent_ID INT PRIMARY KEY,
    Name VARCHAR(100),
    Contact_Details VARCHAR(100)
);

CREATE TABLE Delivery (
    Delivery_ID INT PRIMARY KEY,
    Order_ID INT,
    Agent_ID INT,
    Delivery_Status VARCHAR(50),
    Delivery_Date DATETIME,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    FOREIGN KEY (Agent_ID) REFERENCES Delivery_Agent(Agent_ID)
);

CREATE TABLE Reservation (
    Reservation_ID INT PRIMARY KEY,
    Customer_ID INT,
    Restaurant_ID INT,
    No_of_People INT,
    Schedule_Type VARCHAR(50),
    Reservation_Time DATETIME,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurant(Restaurant_ID)
);

CREATE TABLE Review (
    Review_ID INT PRIMARY KEY,
    Customer_ID INT,
    Restaurant_ID INT,
    Agent_ID INT,
    Rating INT,
    Comments VARCHAR(255),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurant(Restaurant_ID),
    FOREIGN KEY (Agent_ID) REFERENCES Delivery_Agent(Agent_ID)
);

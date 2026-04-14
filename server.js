const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Database Connection ───────────────────────────────────────────────────────
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'diaan',
  database: 'restaurant_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database: restaurant_db');
});

// ── Routes ────────────────────────────────────────────────────────────────────

// GET all menu items
app.get('/api/menu', (req, res) => {
  const sql = `
    SELECT m.Menu_ID, m.Item_Name, m.Price, r.Restaurant_Name, rc.Cuisine_Type
    FROM Menu_New m
    JOIN Restaurant r ON m.Restaurant_ID = r.Restaurant_ID
    JOIN Restaurant_Cuisine rc ON r.Restaurant_ID = rc.Restaurant_ID
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all restaurants
app.get('/api/restaurants', (req, res) => {
  const sql = `
    SELECT r.*, rc.Cuisine_Type
    FROM Restaurant r
    JOIN Restaurant_Cuisine rc ON r.Restaurant_ID = rc.Restaurant_ID
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all reviews with avg rating
app.get('/api/reviews', (req, res) => {
  const sql = `
    SELECT rv.Review_ID, rv.Rating, rv.Comments,
           c.First_Name, c.Last_Name,
           r.Restaurant_Name
    FROM Review rv
    JOIN Customer c ON rv.Customer_ID = c.Customer_ID
    JOIN Restaurant r ON rv.Restaurant_ID = r.Restaurant_ID
    ORDER BY rv.Review_ID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new reservation
app.post('/api/reservation', (req, res) => {
  const { firstName, lastName, phone, restaurantId, scheduleType, noOfPeople } = req.body;

  if (!firstName || !lastName || !phone || !restaurantId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // First, insert or find the customer
  const findCustomer = `SELECT Customer_ID FROM Customer WHERE Phone = ?`;
  db.query(findCustomer, [phone], (err, customers) => {
    if (err) return res.status(500).json({ error: err.message });

    const makeReservation = (customerId) => {
      const getMaxId = `SELECT COALESCE(MAX(Reservation_ID), 0) + 1 AS next_id FROM Reservation`;
      db.query(getMaxId, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const reservationId = rows[0].next_id;

        const sql = `
          INSERT INTO Reservation (Reservation_ID, Customer_ID, Restaurant_ID, No_of_People, Schedule_Type, Reservation_Time)
          VALUES (?, ?, ?, ?, ?, NOW())
        `;
        db.query(sql, [reservationId, customerId, restaurantId, noOfPeople || 2, scheduleType || 'Dinner'], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, message: 'Reservation confirmed!', reservationId });
        });
      });
    };

    if (customers.length > 0) {
      makeReservation(customers[0].Customer_ID);
    } else {
      const getMaxCustId = `SELECT COALESCE(MAX(Customer_ID), 0) + 1 AS next_id FROM Customer`;
      db.query(getMaxCustId, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const customerId = rows[0].next_id;
        const insertCustomer = `
          INSERT INTO Customer (Customer_ID, First_Name, Last_Name, Phone, Email, Pincode, Tower_Name)
          VALUES (?, ?, ?, ?, '', '', '')
        `;
        db.query(insertCustomer, [customerId, firstName, lastName, phone], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          makeReservation(customerId);
        });
      });
    }
  });
});

// POST a new order
app.post('/api/order', (req, res) => {
  const { customerId, items, paymentMethod } = req.body;

  if (!customerId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getMaxOrderId = `SELECT COALESCE(MAX(Order_ID), 1000) + 1 AS next_id FROM Orders`;
  db.query(getMaxOrderId, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const orderId = rows[0].next_id;

    const insertOrder = `
      INSERT INTO Orders (Order_ID, Total_Amount, Customer_ID, Order_Timestamp)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(insertOrder, [orderId, totalAmount, customerId], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Insert order items
      const itemValues = items.map((item, i) => [orderId * 100 + i, orderId, item.menuId, item.quantity]);
      const insertItems = `INSERT INTO Order_Items (O_ItemID, Order_ID, Menu_ID, Quantity) VALUES ?`;
      db.query(insertItems, [itemValues], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Insert payment
        const getMaxPayId = `SELECT COALESCE(MAX(Payment_ID), 0) + 1 AS next_id FROM Payment`;
        db.query(getMaxPayId, (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          const paymentId = rows[0].next_id;

          const insertPayment = `
            INSERT INTO Payment (Payment_ID, Order_ID, Method, Status, Amount)
            VALUES (?, ?, ?, 'Pending', ?)
          `;
          db.query(insertPayment, [paymentId, orderId, paymentMethod || 'UPI', totalAmount], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Order placed!', orderId, totalAmount });
          });
        });
      });
    });
  });
});

// GET total revenue (query insight)
app.get('/api/stats', (req, res) => {
  const sql = `
    SELECT
      (SELECT SUM(Amount) FROM Payment WHERE Status = 'Completed') AS total_revenue,
      (SELECT COUNT(*) FROM Orders) AS total_orders,
      (SELECT COUNT(*) FROM Customer) AS total_customers,
      (SELECT AVG(Rating) FROM Review) AS avg_rating
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Serve the website for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 API endpoints:`);
  console.log(`   GET  /api/menu`);
  console.log(`   GET  /api/restaurants`);
  console.log(`   GET  /api/reviews`);
  console.log(`   GET  /api/stats`);
  console.log(`   POST /api/reservation`);
  console.log(`   POST /api/order`);
});

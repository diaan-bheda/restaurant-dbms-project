# 🍛 Restaurant Delivery & Dine-In Management System

> DBMS Mini Project — Mukesh Patel School of Technology Management & Engineering  
> AY 2025-26 | Team: E006 Kushal Asnani · E011 Diaan Bheda · E022 Arham Gulechha

A full-stack restaurant management system with a MySQL database backend and a live website frontend.

---

## 📁 Project Structure

```
restaurant-dbms-project/
├── server.js              ← Node.js Express backend (API server)
├── package.json           ← Node dependencies
├── public/
│   └── index.html         ← Frontend website (connected to DB)
├── sql/
│   ├── schema.sql         ← CREATE TABLE statements
│   ├── data.sql           ← INSERT sample data
│   └── queries.sql        ← SQL query insights
└── README.md
```

---

## 🚀 How to Run

### 1. Set up MySQL
```sql
-- Run these in MySQL (VS Code or MySQL Workbench)
source sql/schema.sql
source sql/data.sql
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Start the server
```bash
node server.js
```

### 4. Open the website
Go to: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Fetch all menu items from DB |
| GET | `/api/restaurants` | Fetch all restaurants |
| GET | `/api/reviews` | Fetch all customer reviews |
| GET | `/api/stats` | Revenue, orders, customer count |
| POST | `/api/reservation` | Save a new reservation to DB |
| POST | `/api/order` | Place a new order |

---

## 🗄️ Database Tables

`Customer` · `Restaurant` · `Restaurant_Cuisine` · `Menu_New` · `Orders` · `Order_Items` · `Payment` · `Delivery_Agent` · `Delivery` · `Reservation` · `Review`

---

## 🛠️ Tech Stack

- **Database**: MySQL 8.0
- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, Vanilla JS
- **Tools**: VS Code, MySQL Database Client Extension, GitHub

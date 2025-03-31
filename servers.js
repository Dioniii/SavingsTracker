const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('./db.js'); // MSSQL connection setup
require("dotenv").config();

const app = express();
app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON ${PORT}`));

// Middleware for verifying JWT

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid Token" });
        req.user = user;
        next();
    });
}


// CHECK USERS TABLE API
app.get("/users", authenticateToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM users");
        res.status(200).json({ success: true, uData: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error", error: error.message });
    }
});

// REGISTER API
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await poolPromise;
        await pool.request()
            .input("name", sql.VarChar, name)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hashedPassword)
            .query("INSERT INTO users (name, email, password_hash) VALUES (@name, @email, @password)");

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// LOGIN API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const pool = await poolPromise;
        const result = await pool.request().input("email", sql.VarChar, email)
            .query("SELECT * FROM users WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });
        
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE ACCOUNT

app.post("/create-account", authenticateToken, async (req, res) => {
    try {
        const {  account_name, balance } = req.body;
        if (! account_name || balance === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name and balance are required"
            });
        }

        const userId = req.user.id; // Get the logged-in user's ID from the token (set by the JWT middleware)
        
        // Insert new account into the database
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)  // Associated with the logged-in user
            .input("account_name", sql.VarChar, account_name)
            .input("balance", sql.Decimal, balance)  // You can set the balance to a default amount or take from the request
            .query(`
                INSERT INTO accounts (user_id,  account_name, balance)
                VALUES (@userId, @account_name, @balance)
            `);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Get all Accounts 
app.get("/accounts", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID from the token

        // Fetch accounts for the current user
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT AccountID AS id, account_name, balance 
                FROM accounts 
                WHERE user_id = @userId
                ORDER BY AccountID DESC
            `);

        res.status(200).json({
            success: true,
            accounts: result.recordset
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

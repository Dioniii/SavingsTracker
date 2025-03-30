const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const { sql, poolPromise } = require('./db.js');  // Assuming 'db.js' handles your MSSQL connection setup.

const app = express();

// Middleware
app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON ${PORT}`));

// CHECK USERS TABLE API
app.get("/users", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(
            "SELECT * FROM users"
        );

        console.log(result);

        res.status(200).json({
            success: true,
            uData: result.recordset
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Error",
            error: error.message
        });
    }
});

// REGISTER API
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, password) // Storing plaintext password (not secure)
            .query("INSERT INTO users (name, email, password_hash) VALUES (@name, @email, @password)");

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            rowsAffected: result.rowsAffected
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// LOGIN API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("email", sql.VarChar, email)  
            .query("SELECT * FROM users WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const storedPassword = result.recordset[0].password_hash; //storing password from database for comparison

        if (password === storedPassword) {  // Password comparison
            return res.status(200).json({
                success: true,
                message: "Login successful",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


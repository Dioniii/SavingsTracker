const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const{sql, poolPormise, poolPromise} = require('./db.js');
const{pool} = require('mssql');

const app = express();

app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON ${PORT}`));


app.get("/users" , async(req,res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query(
            "Select * From users"
        )

        console.log(result);

        res.status(200).json({
            success:true,
            uData: result.recordset
        })
    }catch(error){
        console.log(error);

        res.status(404).json({
            success:false,
            message: "Errror",
            error: error.message
        })
    }
})
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const{sql, poolPormise} = require('./db.js');
const{pool} = require('mssql');

const app = express();

app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON ${PORT}`));


console.log("nice");
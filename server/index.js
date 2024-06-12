const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const register = require('./register');
const dbConfig = require('./config/db.config');
const mysql = require('mysql2/promise.js');
const apiRouter = require("./routes");


const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Allow this origin
    credentials: true
  };

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));
app.use(cookieParser());


try {
    mysql.createConnection(dbConfig);
    console.log("Connected to database");
} catch (error) {
    console.log("Error connection to database", error);
}


app.use('/signup',apiRouter)

app.listen(8080, () =>{
    console.log("Server Running on 8080");
});

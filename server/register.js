const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dbConfig = require('./config/db.config');
const getuserByID = require('./database');
const { json } = require('express');
const salt = 10;



async function register (req, res){
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {email, password, role} = req.body;

        console.log(email,password,role);

        const user = await getuserByID(email);
        console.log(user);

        if (user !== null ) {
            return res.status(400).json({message:'User already exits'});  
                 
        } else {
            const hashedPassword = await bcrypt.hash(password,salt);
            const insertQuery = 'INSERT INTO user (email,password,role) VALUES (?, ?, ?)';
            try {
                await connection.query(insertQuery,[email,hashedPassword,role]);
                return res.status(200).json({message:'User Registration Successfull'});
            } catch (error) {
                console.log('Failed to register',error);
                return res.status(201),json({message:'User Registration Failed'});   
            }
        }
    } catch (error) {
        console.log('Operation Failed', error);
        return res.status(201).json({message:'Server Error'});
    }
}
module.exports = register;
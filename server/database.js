const config = require('./config/db.config');
const mysql = require('mysql2/promise');

const getuserByID = async(userId) => {
    console.log(userId);
    const checkedUserQuery = 'SELECT * FROM user WHERE email = ? '
    try {
        const connection = await mysql.createConnection(config);

        const [rows, fields] = await connection.query(checkedUserQuery,[userId]);

        console.log(rows.length);

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        return console.log("Database Error",error);
    }
}

module.exports = getuserByID;
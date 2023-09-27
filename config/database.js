/** 내가 연결할 DB에 대한 정보 */
const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    port: 3306,
    database: "nodejs",
});
conn.connect();

module.exports = conn;

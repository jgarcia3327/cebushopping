const mysql = require('mysql2');
const conn = mysql.createPool({
    host: process.env.DB_HOST,
    dabase: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const sql = "INSERT INTO movies (yify_id, torrent_json) VALUES ?";
const values = [['123',JSON.parse("{1}")],['124',JSON.parse("{2}")]];
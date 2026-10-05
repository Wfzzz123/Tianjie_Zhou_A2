const mysql = require('mysql2');

// Update these two fields for the marker's MySQL account.
const connection = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 3306),
  database: 'charityevents_db',
  connectionLimit: 8
});

module.exports = connection.promise();

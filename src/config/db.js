const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'simrbi',
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0
}); 

const testConnection = async () => { 
    try { 
        const connection = await pool.getConnection(); 
        console.log('Mysql Conectado'); 
        connection.release(); 
    } catch (error) { 
        console.error('Error en la conexión: ', error.message); 
        process.exit(1); 
    }
}; 

testConnection(); 

module.exports = pool; 
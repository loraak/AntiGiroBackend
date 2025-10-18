const mysql = require('mysql2/promise'); 
const mongoose = require('mongoose'); 
require('dotenv').config(); 

const pool = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'simrbi',
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0
}); 

const testConnectionMysql = async () => { 
    try { 
        const connection = await pool.getConnection(); 
        console.log('Mysql Conectado'); 
        connection.release(); 
    } catch (error) { 
        console.error('Error en la conexión: ', error.message); 
        process.exit(1); 
    }
}; 

const connectMongoDB = async () => { 
    try { 
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simbi_iot'); 
        console.log('MongoDB Conectado'); 
    } catch (error) { 
        console.error('Error conectando a MongoDb:', error.mesage); 
        process.exit(1); 
    }
    }; 

    const initDatabases = async () => { 
        await testConnectionMysql(); 
        await connectMongoDB(); 
    }

    initDatabases(); 


module.exports = {
    mysql: pool, 
    mongoose
}; 
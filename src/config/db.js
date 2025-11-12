const mysql = require('mysql2/promise'); 
const mongoose = require('mongoose'); 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log('Variables de entorno en producción:');
console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
});

const pool = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root', 
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'simrbi',
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0
}); 

const testConnectionMysql = async () => { 
    try { 
        console.log('Intentando conectar a MySQL...'); 
        console.log('Host:', process.env.DB_HOST || 'localhost');
        console.log('User:', process.env.DB_USER || 'root');
        console.log('Database:', process.env.DB_NAME || 'simrbi');
        
        const connection = await pool.getConnection(); 
        console.log('MySQL Conectado'); 
        connection.release(); 
    } catch (error) { 
        console.error('Error completo:', error); 
        process.exit(1); 
    }
};

const connectMongoDB = async () => { 
    try { 
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log('MongoDB Conectado'); 
        return true;
    } catch (error) { 
        console.error('Error conectando a MongoDB:', error.message); 
        return false;
    }
}; 

const initDatabases = async () => { 
    const mysqlConnected = await testConnectionMysql(); 
    const mongoConnected = await connectMongoDB();
    
    if (!mysqlConnected && !mongoConnected) {
        console.error('No se pudo conectar a ninguna base de datos');
        process.exit(1);
    }
    
    if (!mysqlConnected) {
        console.warn('Continuando sin MySQL');
    }
    
    if (!mongoConnected) {
        console.warn('Continuando sin MongoDB');
    }
}

initDatabases(); 

module.exports = {
    mysql: pool, 
    mongoose
};
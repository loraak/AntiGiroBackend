require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'SIMRBI'
});

try {
    //contraseña
    const hashedPassword = await bcrypt.hash('spamton4ever', 10);

    //cambiar acá
    await connection.query('INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)', ['Anthony', 'tenna@gmail.com', hashedPassword, 'admin']);

    console.log('Usuario creado');

} catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
    console.log('El usuario ya existe');
} else {
    console.error('Error:', error.message);
}
} finally {
    await connection.end();
}
}

createTestUser();
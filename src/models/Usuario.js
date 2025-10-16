const db = require ('../config/db'); 
const bcrypt = require ('bcryptjs');

class Usuario { 
    static async findAll() { 
        const [rows] = await db.query( 
            'SELECT id_usuario, nombre, correo, rol, activo, creado_en FROM usuarios WHERE activo = TRUE'
        ); 
        return rows; 
    }

    static async findById(id) { 
        const [rows] = await db.query('SELECT id_usuario, nombre, correo, rol, activo, creado_en FROM usuarios WHERE id_usuario = ? AND activo = TRUE', [id]);
        return rows[0];
    }

    static async findByEmail(correo) { 
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ? AND activo = TRUE', [correo]); 
        return rows[0]; 
    }

    static async verifyPassword(plainPassword, hashedPassword) { 
        return await bcrypt.compare(plainPassword, hashedPassword); 
    }


}

module.exports = Usuario; 
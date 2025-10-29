const {mysql:db} = require ('../config/db'); 
const bcrypt = require ('bcryptjs');

class Usuario { 
    static async findAll() { 
        const [rows] = await db.query( 
            'SELECT id_usuario, nombre, correo, rol, activo, creado_en FROM usuarios'
        ); 
        return rows; 
    }

    static async findById(id) { 
        const [rows] = await db.query('SELECT id_usuario, nombre, correo, rol, activo, creado_en FROM usuarios WHERE id_usuario = ?', [id]);
        return rows[0];
    }

    static async findByEmail(correo) { 
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ? AND activo = TRUE', [correo]); 
        return rows[0]; 
    }

    static async verifyPassword(plainPassword, hashedPassword) { 
        return await bcrypt.compare(plainPassword, hashedPassword); 
    }

    static async incrementarIntentosFallidos(id) { 
        await db.query('UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1, ultimo_intento = NOW() WHERE id_usuario = ?', [id]);
    }

    static async bloquearUsuario(id, minutos = 15) { 
        await db.query('UPDATE usuarios SET bloqueado_hasta = DATE_ADD(NOW(), INTERVAL ? MINUTE), ultimo_intento = NOW() WHERE id_usuario = ?', [minutos, id]);
    }

    static async resetearIntentos(id) { 
        await db.query('UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id_usuario = ?', [id]);
    }

    static async estaBloqueado(id) { 
        const [rows] = await db.query('SELECT bloqueado_hasta, TIMESTAMPDIFF(MINUTE, NOW(), bloqueado_hasta) AS minutos_restantes FROM usuarios WHERE id_usuario = ?', [id]);

        if (!rows[0] || !rows[0].bloqueado_hasta) {
            return {bloqueado: false}; 
        }

        const ahora = new Date(); 
        const bloqueadoHasta = new Date(rows[0].bloqueado_hasta);

        if (ahora < bloqueadoHasta) {
            return { 
                bloqueado: true, 
                minutos_restantes: rows[0].minutos_restantes
            }; 
        }
        await this.resetearIntentos(id); 
        return {bloqueado: false};
    }

    static async create(userData) { 
        const {nombre, correo, contrasena, rol} = userData; 

        const hashedPassword = await bcrypt.hash(contrasena, 10); 

        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)', [nombre, correo, hashedPassword, rol]); 
            return this.findById(result.insertId); 
    }

    static async update(id, userData) { 
        const {nombre, correo, rol, activo} = userData; 

        await db.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, activo = ? WHERE id_usuario = ?', [nombre, correo, rol, activo, id]
        ); 

        return this.findById(id); 
    }
}

module.exports = Usuario; 
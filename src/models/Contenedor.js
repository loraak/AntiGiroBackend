const {mysql:db} = require ('../config/db'); 

class Contenedor { 
    static async findAll() { 
        const [rows] = await db.query(`SELECT c.*, u.nombre as nombre_usuario, u.correo as correo_usuario FROM contenedores c LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario WHERE c.activo = TRUE ORDER BY c.id_contenedor`); 
        return rows; 
    }

    static async findById(id) { 
        const [rows] = await db.query(`SELECT c.*, u.nombre as nombre_usuario, u.correo as correo_usuario FROM contenedores c LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario WHERE c.id_contenedor = ?`, [id]); 
        return rows[0]; 
    }

    static async create(data) { 
        const { nombre, peso_maximo, nivel_alerta, id_usuario } = data; 
        const [result] = await db.query('INSERT INTO contenedores(nombre, peso_maximo, nivel_alerta, id_usuario) VALUES (?,?,?,?)', [nombre, peso_maximo, nivel_alerta, id_usuario]); 
        return this.findById(result.insertId); 
    }

    static async update(id, data) { 
        const { nombre, peso_maximo, nivel_alerta } = data; 

        await db.query('UPDATE contenedores SET nombre = ?, peso_maximo = ?, nivel_alerta = ? WHERE id_contenedor = ?', [nombre, peso_maximo, nivel_alerta, id]); 
        return this.findById(id); 
    }

    static async delete(id) { 
        await db.query('UPDATE contenedores SET activo = FALSE where id_contenedor = ?', [id]); 
        return true; 
    } 
}

module.exports = Contenedor; 
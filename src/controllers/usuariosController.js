const Usuario = require ('../models/Usuario'); 

const getAll = async (req, res) => {
    try { 
        const usuarios = await Usuario.findAll(); 
        res.json({ 
            success: true, 
            data: usuarios
        }); 
    } catch (error) { 
        console.error('Error al obtener usuarios:', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error obteniendo usuarios'
        }); 
    }
}; 

module.exports = getAll;
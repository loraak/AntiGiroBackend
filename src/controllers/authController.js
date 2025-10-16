const Usuario = require('../models/Usuario'); 
const jwt = require('jsonwebtoken');

const login = async(req, res) => { 
    try { 
        const { correo, contrasena } = req.body; 

        if (!correo || !contrasena) { 
            return res.status(400).json({ 
                success: false, 
                message: 'Correo y contraseña son requeridos'
            }); 
        }

        const usuario = await Usuario.findByEmail(correo); 

        if (!usuario) { 
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas', 
            });
        }

        const isValidPassword = await Usuario.verifyPassword(contrasena, usuario.contrasena); 

        if (!isValidPassword) { 
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas',
            });
        }

        const token = jwt.sign( 
            {
                id: usuario.id_usuario, 
                correo: usuario.correo, 
                rol: usuario.rol
            }, 
            process.env.JWT_SECRET || 'default', 
            { expiresIn: '8h' }
        ); 

        res.json({ 
            success: true, 
            message: 'Inicio de sesión exitoso',
            token, 
            usuario: { 
                id: usuario.id_usuario, 
                nombre: usuario.nombre, 
                correo: usuario.correo, 
                rol: usuario.rol 
            }
        }); 
    } catch (error) { 
        console.error('Error en login: ', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor'
        }); 
    }
}; 

module.exports = { login };
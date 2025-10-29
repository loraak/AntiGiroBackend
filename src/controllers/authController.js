const Usuario = require('../models/Usuario'); 
const jwt = require('jsonwebtoken');

const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO_MINUTOS = 15;

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

        const estadoBloqueo = await Usuario.estaBloqueado(usuario.id_usuario);
        
        if (estadoBloqueo.bloqueado) {
            return res.status(423).json({
                success: false,
                message: `Cuenta bloqueada temporalmente. Intenta nuevamente en ${estadoBloqueo.minutos_restantes} minutos.`,
                bloqueado: true,
                minutos_restantes: estadoBloqueo.minutos_restantes
            });
        }

        const usuarioActualizado = await Usuario.findByEmail(correo);

        const isValidPassword = await Usuario.verifyPassword(contrasena, usuarioActualizado.contrasena); 

        if (!isValidPassword) {
            await Usuario.incrementarIntentosFallidos(usuarioActualizado.id_usuario);
            
            const intentosRestantes = MAX_INTENTOS - (usuarioActualizado.intentos_fallidos + 1);

            if (intentosRestantes <= 0) {
                await Usuario.bloquearUsuario(usuarioActualizado.id_usuario, TIEMPO_BLOQUEO_MINUTOS);
                
                return res.status(423).json({
                    success: false,
                    message: `Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por ${TIEMPO_BLOQUEO_MINUTOS} minutos.`,
                    bloqueado: true,
                    minutos_restantes: TIEMPO_BLOQUEO_MINUTOS
                });
            }

            return res.status(401).json({ 
                success: false, 
                message: `Credenciales inválidas. Te quedan ${intentosRestantes} intentos.`,
                intentos_restantes: intentosRestantes
            });
        }

        await Usuario.resetearIntentos(usuarioActualizado.id_usuario);

        const token = jwt.sign( 
            {
                id: usuarioActualizado.id_usuario, 
                correo: usuarioActualizado.correo, 
                rol: usuarioActualizado.rol
            }, 
            process.env.JWT_SECRET || 'default', 
            { expiresIn: '8h' }
        ); 

        res.json({ 
            success: true, 
            message: 'Inicio de sesión exitoso',
            token, 
            usuario: { 
                id: usuarioActualizado.id_usuario, 
                nombre: usuarioActualizado.nombre, 
                correo: usuarioActualizado.correo, 
                rol: usuarioActualizado.rol 
            }
        }); 
    } catch (error) { 
        console.error('Error en login:', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor'
        }); 
    }
};

module.exports = { login };
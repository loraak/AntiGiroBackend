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
}

    const getById = async (req, res) => {
        try { 
            const usuario = await Usuario.findById(req.params.id); 

            if(!usuario) { 
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuario no encontrado'
                }); 
            }
            res.json({
                success: true, 
                data: usuario
            }); 
        } catch (error) { 
            console.error('Error obteniendo usuario: ', error), 
            res.status(500).json({
                success: false, 
                message: 'Error obteniendo usuario'
            }); 
        }
    }; 

    const create = async (req, res) => { 
        try { 
            const {nombre, correo, contrasena, rol} = req.body; 

            if (!nombre || !correo || !contrasena) { 
                return res.status(400).json({ 
                    success: false, 
                    message: 'Todos los campos son requeridos'
                }); 
            }

            const usuario = await Usuario.create({nombre, correo, contrasena, rol}); 

            res.status(201).json({ 
                success: true, 
                message: 'Usuario creado', 
                data: usuario 
            }); 
        } catch (error) { 
            console.error('Error creando usuario: ', error); 

            //Correo duplicado 
            if(error.code == 'ER_DUP_ENTRY') { 
                return res.status(400).json({ 
                    success: false, 
                    message: 'El correo ya está registrado'
                }); 
            }

            res.status(500).json({
                success: false, 
                message: 'Error creando usuario'
            }); 
        }
    }; 

    const update = async (req, res) => { 
        try { 
            const {nombre, correo, rol, activo} = req.body; 

            const usuario = await Usuario.update(req.params.id, {nombre, correo, rol, activo}); 

            if (!usuario) { 
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuario no encontrado'
                }); 
            }

            res.json({ 
                success: true, 
                message: 'Usuario actualizado', 
                data: usuario 
            });  
        } catch (error) { 
            console.error('Error actualizando usuario:', error); 
            res.status(500).json({ 
                success: false, 
                message: 'Error actualizando'
            }); 
        }
    };

module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
}
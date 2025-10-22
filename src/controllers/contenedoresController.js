const Contenedor = require ('../models/Contenedor'); 

const getAll = async (req, res) => { 
    try { 
        const contenedores = await Contenedor.findAll(); 
        res.json({ 
            success: true, 
            data: contenedores
        }); 
    } catch (error) { 
        console.error('Error obteniendo contenedores:', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error obteniendo contenedores'
        }); 
    }
}; 

const getById = async (req, res) => { 
    try { 
        const contenedor = await Contenedor.findById(req.params.id); 

        if(!contenedor) { 
            return res.status(404).json({ 
                success: false, 
                message: 'Contenedor no encontrado'
            }); 
        }
        res.json({
            success: true, 
            data:contenedor 
        }); 
    } catch (error) { 
        console.error('Error obteniendo contenedor: ', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error obteniendo contenedor'
        }); 
    }
}; 

const create = async(req, res) => { 
    try { 
        const { nombre, ubicacion, peso_maximo, nivel_alerta, id_usuario} = req.body; 

        if (!nombre || !ubicacion || !id_usuario) { 
            return res.status(400).json({ 
                success: false, 
                message: 'Nombre y ubicación requeridos'
            }); 
        }
        const contenedor = await Contenedor.create({ 
            nombre, 
            ubicacion, 
            peso_maximo, 
            nivel_alerta, 
            id_usuario
        }); 
        res.status(201).json({ 
            success: true, 
            message: 'Contenedor creado', 
            data: contenedor
        }); 
    } catch (eror) { 
        console.error('Error creando contenedor:', error); 
        res.status(500).json({
            success: false, 
            message: 'Error creando contenedor'
        }); 
    }
}; 

const update = async (req, res) => { 
    try { 
        const { nombre, ubicacion, peso_maximo, nivel_alerta } = req.body; 

        const contenedor = await Contenedor.update(req.params.id, { nombre, ubicacion, peso_maximo, nivel_alerta}); 

        if (!contenedor) { 
            return res.status(404).json({ 
                success: false, 
                message: 'Contenedor no encontrado'
            }); 
        }

        res.json({ 
            success: true, 
            message: 'Contenedor actualizado', 
            data: contenedor
        }); 
    } catch (error) { 
        console.error('Error actualizando contenedor: ', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error actualizando contenedor'
        }); 
    }; 
}

const deleteContenedor = async (req, res) => { 
    try { 
        await Contenedor.delete(req.params.id); 
        res.json({ 
            success: true, 
            message: 'Contenedor eliminado'
        }); 
    } catch (error) { 
        console.error('Error eliminando contenedor: ', error); 
        res.status(500).json({
            success: false, 
            message: 'Error eliminando contenedor'
        }); 
    }
}; 

module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
    delete: deleteContenedor
}; 
const Lectura = require('../models/Lectura');

const getAll = async (req, res) => {
try {
    const { page = 1, limit = 50, id_contenedor } = req.query;
    
    const filter = {};
    if (id_contenedor) {
        filter.id_contenedor = parseInt(id_contenedor);
    }

    const lecturas = await Lectura.find(filter)
        .sort({ timestamp: -1 }) 
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    const total = await Lectura.countDocuments(filter);

    res.json({
        success: true,
        data: lecturas,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
        });
    } catch (error) {
        console.error('Error obteniendo lecturas:', error);
        res.status(500).json({
        success: false,
        message: 'Error obteniendo lecturas'
        });
    }
};

// Obtener lecturas por contenedor
const getByContenedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100, desde, hasta } = req.query;

    const filter = { id_contenedor: parseInt(id) };

    if (desde || hasta) {
        filter.timestamp = {};
        if (desde) filter.timestamp.$gte = new Date(desde);
        if (hasta) filter.timestamp.$lte = new Date(hasta);
    }

    const lecturas = await Lectura.find(filter)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .lean();

    res.json({
        success: true,
        data: lecturas,
        total: lecturas.length
    });
} catch (error) {
    console.error('Error obteniendo lecturas por contenedor:', error);
    res.status(500).json({
        success: false,
        message: 'Error obteniendo lecturas'    
    });
    }
};

// Obtener última lectura de un contenedor
const getUltima = async (req, res) => {
try {
    const { id } = req.params;

    const lectura = await Lectura.findOne({ id_contenedor: parseInt(id) })
        .sort({ timestamp: -1 })
        .lean();

    if (!lectura) {
        return res.status(404).json({
            success: false,
            message: 'No se encontraron lecturas para este contenedor'
        });
    }

    res.json({
        success: true,
        data: lectura
    });
} catch (error) {
    console.error('Error obteniendo última lectura:', error);
    res.status(500).json({
        success: false,
        message: 'Error obteniendo lectura'
        });
}
};

const create = async (req, res) => {
try {
    const lectura = new Lectura(req.body);
    await lectura.save();

    res.status(201).json({
        success: true,
        message: 'Lectura registrada exitosamente',
        data: lectura
    });
} catch (error) {
    console.error('Error creando lectura:', error);
    
    if (error.name === 'ValidationError') {
    return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(e => e.message)
    });
    }

    res.status(500).json({
        success: false,
        message: 'Error creando lectura'
    });
}
};

// Obtener estadísticas de un contenedor
const getEstadisticas = async (req, res) => {
try {
    const { id } = req.params;
    const { dias = 7 } = req.query;

    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - parseInt(dias));

    const stats = await Lectura.aggregate([
        {
            $match: {
            id_contenedor: parseInt(id),
            timestamp: { $gte: fechaInicio }
            }
        },
        {
            $group: {
            _id: null,
            peso_promedio: { $avg: '$peso' },
            peso_maximo: { $max: '$peso' },
            peso_minimo: { $min: '$peso' },
            nivel_promedio: { $avg: '$nivel' },
            nivel_maximo: { $max: '$nivel' },
            total_lecturas: { $sum: 1 },
            alertas_activas: {
                $sum: { $cond: ['$alerta.activo', 1, 0] }
            }
            }
        }
    ]);

    if (stats.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No hay datos para calcular estadísticas'
        });
    }

    res.json({
        success: true,
        data: {
            periodo_dias: parseInt(dias),
            ...stats[0]
        }
    });
} catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
        success: false,
        message: 'Error obteniendo estadísticas'
    });
}
};

const getAlertas = async (req, res) => {
try {
    const { id_contenedor } = req.query;

    const filter = { 'alerta.activo': true };
    if (id_contenedor) {
        filter.id_contenedor = parseInt(id_contenedor);
    }

    const alertas = await Lectura.find(filter)
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();

    res.json({
        success: true,
        data: alertas,
        total: alertas.length
    });
} catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({
        success: false,
        message: 'Error obteniendo alertas'
    });
}
};

module.exports = {
    getAll,
    getByContenedor,
    getUltima,
    create,
    getEstadisticas,
    getAlertas
};
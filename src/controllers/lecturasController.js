const LecturaPeso = require('../models/LecturaPeso'); 
const LecturaNivel = require('../models/LecturaNivel'); 
const EventoElectroiman = require('../models/EventoElectroiman'); 
const Alerta = require('../models/Alerta');

const getAll = async (req, res) => { 
    try { 
        const { page = 1, limit = 50, id_contenedor } = req.query; 

        const filter = {}; 
        if (id_contenedor) { 
            filter.id_contenedor = parseInt(id_contenedor); 
        }

        const skip = (page - 1) * limit; 
        const [pesos, niveles, electroiman] = await Promise.all([
            LecturaPeso.find(filter) 
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .skip(skip)
                .lean(), 
            LecturaNivel.find(filter)
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .skip(skip)
                .lean(), 
            EventoElectroiman.find(filter)
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .skip(skip)
                .lean()
        ]); 

        const lecturasConsolidadas = consolidarLecturas(pesos, niveles, electroiman); 

        const total = await LecturaPeso.countDocuments(filter); 

        res.json({
            success: true, 
            data: lecturasConsolidadas, 
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

        const [pesos, niveles, electroiman] = await Promise.all([
            LecturaPeso.find(filter)
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .lean(), 
            LecturaNivel.find(filter) 
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .lean(), 
            EventoElectroiman.find(filter) 
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .lean()
        ]); 

        const lecturasConsolidadas = consolidarLecturas(pesos, niveles, electroiman); 

        res.json({
            success: true, 
            data: lecturasConsolidadas, 
            total: lecturasConsolidadas.length
        }); 
    } catch (error) { 
        console.error('Error obteniendo lecturas por contenedor:', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error obteniendo lecturas'
        }); 
    }
}; 

const getUltima = async (req, res) => { 
    try { 
        const { id } = req.params; 
        const filter = { id_contenedor: parseInt(id) }; 

        const [ultimoPeso, ultimoNivel, ultimoElectroiman] = await Promise.all([
            LecturaPeso.findOne(filter).sort({ timestamp: -1 }).lean(), 
            LecturaNivel.findOne(filter).sort({ timestamp: -1 }).lean(), 
            EventoElectroiman.findOne(filter).sort({ timestamp: -1 }).lean()
        ]); 

        if (!ultimoPeso && !ultimoNivel && !ultimoElectroiman) { 
            return res.status(404).json({
                success: false, 
                message: 'No se encontraron lecturas para este contenedor'
            }); 
        }

        const lectura = { 
            id_contenedor: parseInt(id), 
            timestamp: ultimoPeso?.timestamp || ultimoNivel?.timestamp || ultimoElectroiman?.timestamp, 
            peso: ultimoPeso?.peso || null, 
            nivel: ultimoNivel?.nivel || null, 
            estado_electroiman: ultimoElectroiman?.estado || null
        }; 

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

const getAlertas = async (req, res) => { 
    try { 
        const { id_contenedor } = req.query; 

        const filter = { activo: true }; 
        if (id_contenedor) { 
            filter.id_contenedor = parseInt(id_contenedor); 
        }

        const alertas = await Alerta.find(filter)
            .sort({ timestamp_inicio: -1 })
            .limit(50)
            .lean(); 

        const alertasFormateadas = alertas.map(alerta => ({ 
            id_contenedor: alerta.id_contenedor, 
            timestamp: alerta.timestamp_inicio, 
            alerta: { 
                tipo: alerta.tipo, 
                mensaje: alerta.mensaje, 
                activo: alerta.activo,
                nivel: alerta.nivel,
                peso: alerta.peso
            }
        })); 

        res.json({ 
            success: true, 
            data: alertasFormateadas, 
            total: alertasFormateadas.length 
        }); 
    } catch (error) { 
        console.error('Error obteniendo alertas:', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener alertas'
        }); 
    }
}; 

function consolidarLecturas(pesos, niveles, electroiman) { 
    const todasLasLecturas = [];

    pesos.forEach(p => {
        todasLasLecturas.push({
            id_contenedor: p.id_contenedor,
            timestamp: p.timestamp,
            peso: p.peso,
            nivel: null,
            estado_electroiman: null,
            _timestamp_ms: p.timestamp.getTime()
        });
    });

    niveles.forEach(n => {
        todasLasLecturas.push({
            id_contenedor: n.id_contenedor,
            timestamp: n.timestamp,
            peso: null,
            nivel: n.nivel,
            estado_electroiman: null,
            _timestamp_ms: n.timestamp.getTime()
        });
    });

    electroiman.forEach(e => {
        todasLasLecturas.push({
            id_contenedor: e.id_contenedor,
            timestamp: e.timestamp,
            peso: null,
            nivel: null,
            estado_electroiman: e.estado,
            _timestamp_ms: e.timestamp.getTime()
        });
    });

    if (todasLasLecturas.length === 0) {
        return [];
    }

    todasLasLecturas.sort((a, b) => b._timestamp_ms - a._timestamp_ms);

    const consolidadas = [];
    const TOLERANCIA_MS = 5000; 

    todasLasLecturas.forEach(lectura => {
        const lecturaExistente = consolidadas.find(c => 
            c.id_contenedor === lectura.id_contenedor &&
            Math.abs(c._timestamp_ms - lectura._timestamp_ms) < TOLERANCIA_MS
        );

        if (lecturaExistente) {
            if (lectura.peso !== null) lecturaExistente.peso = lectura.peso;
            if (lectura.nivel !== null) lecturaExistente.nivel = lectura.nivel;
            if (lectura.estado_electroiman !== null) lecturaExistente.estado_electroiman = lectura.estado_electroiman;
        } else {
            consolidadas.push({ ...lectura });
        }
    });

    consolidadas.forEach(c => delete c._timestamp_ms);

    return consolidadas;
}

module.exports = { 
    getAll, 
    getByContenedor, 
    getUltima, 
    getAlertas
};
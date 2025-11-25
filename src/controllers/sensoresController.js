const LecturaPeso = require('../models/LecturaPeso');
const LecturaNivel = require('../models/LecturaNivel');
const EventoElectroiman = require('../models/EventoElectroiman');
const AlertaService = require('../services/alertaServices');

const crearLecturaPeso = async (req, res) => {
    try {
        
        const nueva = new LecturaPeso(req.body);
        await nueva.save();


        await AlertaService.procesarAlertaPeso({
            id_contenedor: nueva.id_contenedor,
            peso: nueva.peso,
            timestamp: nueva.timestamp
        });

        res.status(201).json({
            success: true,
            mensaje: 'Lectura de peso guardada',
            data: nueva
        });
    } catch (error) {
        console.error('Error guardando peso:', error);
        console.error('Detalles del error:', JSON.stringify(error.errInfo, null, 2));
        console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
        
        res.status(400).json({
            success: false,
            message: 'Error guardando lectura de peso',
            error: error.message,
            details: error.errInfo 
        });
    }
};

const crearLecturaNivel = async (req, res) => {
    try {
        
        const nueva = new LecturaNivel(req.body);
        await nueva.save();


        await AlertaService.procesarAlertaNivel({
            id_contenedor: nueva.id_contenedor,
            nivel: nueva.nivel,
            timestamp: nueva.timestamp
        });

        res.status(201).json({
            success: true,
            mensaje: 'Lectura de nivel guardada',
            data: nueva
        });
    } catch (error) {
        console.error('Error guardando nivel:', error);
        console.error('Detalles del error:', JSON.stringify(error.errInfo, null, 2));
        console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
        
        res.status(400).json({
            success: false,
            message: 'Error guardando lectura de nivel',
            error: error.message,
            details: error.errInfo 
        });
    }
};

const crearEventoElectroiman = async (req, res) => {
    try {
        
        const nuevo = new EventoElectroiman(req.body);
        await nuevo.save();
                
        res.status(201).json({
            success: true,
            mensaje: 'Evento de electroimán guardado',
            data: nuevo
        });
    } catch (error) {
        console.error('Error guardando evento electroimán:', error);
        console.error('Detalles del error:', JSON.stringify(error.errInfo, null, 2));
        console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
        
        res.status(400).json({
            success: false,
            message: 'Error guardando evento de electroimán',
            error: error.message,
            details: error.errInfo
        });
    }
};

const obtenerAlertasActivas = async (req, res) => {
    try {
        const { id_contenedor } = req.query;
        const alertas = await AlertaService.obtenerAlertasActivas(
            id_contenedor ? parseInt(id_contenedor) : null
        );

        res.status(200).json({
            success: true,
            cantidad: alertas.length,
            data: alertas
        });
    } catch (error) {
        console.error('Error obteniendo alertas activas:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo alertas activas',
            error: error.message
        });
    }
};

const obtenerHistorialAlertas = async (req, res) => {
    try {
        const { id_contenedor, limite } = req.query;
        const historial = await AlertaService.obtenerHistorial(
            id_contenedor ? parseInt(id_contenedor) : null,
            limite ? parseInt(limite) : 50
        );

        res.status(200).json({
            success: true,
            cantidad: historial.length,
            data: historial
        });
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo historial de alertas',
            error: error.message
        });
    }
};

module.exports = {
    crearLecturaPeso,
    crearLecturaNivel,
    crearEventoElectroiman,
    obtenerAlertasActivas,     
    obtenerHistorialAlertas,   
};
const LecturaPeso = require('../models/LecturaPeso');
const LecturaNivel = require('../models/LecturaNivel');
const EventoElectroiman = require('../models/EventoElectroiman');
const Alerta = require('../models/Alerta');

const crearLecturaPeso = async (req, res) => {
    try {
        const nueva = new LecturaPeso(req.body);
        await nueva.save();
        res.status(201).json({
            success: true,
            mensaje: 'Lectura de peso guardada',
            data: nueva
        });
    } catch (error) {
        console.error('Error guardando peso:', error);
        res.status(400).json({
            success: false,
            message: 'Error guardando lectura de peso',
            error: error.message
        });
    }
};

const crearLecturaNivel = async (req, res) => {
    try {
        const nueva = new LecturaNivel(req.body);
        await nueva.save();
        res.status(201).json({
            success: true,
            mensaje: 'Lectura de nivel guardada',
            data: nueva
        });
    } catch (error) {
        console.error('Error guardando nivel:', error);
        res.status(400).json({
            success: false,
            message: 'Error guardando lectura de nivel',
            error: error.message
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
        res.status(400).json({
            success: false,
            message: 'Error guardando evento de electroimán',
            error: error.message
        });
    }
};

const crearAlerta = async (req, res) => {
    try {
        const nueva = new Alerta(req.body);
        await nueva.save();
        res.status(201).json({
            success: true,
            mensaje: 'Alerta registrada',
            data: nueva
        });
    } catch (error) {
        console.error('Error registrando alerta:', error);
        res.status(400).json({
            success: false,
            message: 'Error registrando alerta',
            error: error.message
        });
    }
};

module.exports = {
    crearLecturaPeso,
    crearLecturaNivel,
    crearEventoElectroiman,
    crearAlerta
};
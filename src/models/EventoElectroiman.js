const mongoose = require ('mongoose'); 

const eventoElectroimanSchema = new mongoose.Schema({
    id_contenedor: { 
        type: Number, 
        required: [true, 'ID requerido'], 
        index: true 
    }, 
    timestamp: { 
        type: Date, 
        required: [true, 'Timestamp requerido'], 
        default: Date.now, 
        index: true
    }, 
    estado: { 
        type: Boolean, 
        required: [true, 'Estado requerido']
    }, 
    accion: { 
        type: String, 
        required: true, 
        enum: ['activacion', 'desactivacion']
    }
}, { 
    timestamps: true, 
    collection: 'eventos_electroiman'
}); 

eventoElectroimanSchema.index({id_contenedor: 1, timestamp: -1}); 

eventoElectroimanSchema.statics.getUltimoEstado = async function(id_contenedor) { 
    return await this.findOne({id_contenedor})
    .sort({timestamp: -1})
    .lean(); 
}; 

module.exports = mongoose.model('EventoElectroiman', eventoElectroimanSchema); 


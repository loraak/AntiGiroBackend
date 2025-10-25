const mongoose = require('mongoose'); 

const lecturaNivelSchema = new mongoose.Schema({ 
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
    nivel: { 
        type: Number, 
        required: [true, 'Nivel requerido'], 
        min: [0, 'El nivel no puede ser negativo'], 
        max: [100, 'El nivel no puede superar 100']
    }, 
    unidad: { 
        type: String, 
        default: 'porcentaje', 
        enum: ['porcentaje']
    }, 
    distancia_cm: { 
        type: Number, 
        min: 0 
    }
}, { 
    timestamps: true, 
    collection: 'lecturas_nivel'
}); 

lecturaNivelSchema.index({ id_contenedor: 1, timestamp: -1}); 

module.exports = mongoose.model('LecturaNivel', lecturaNivelSchema);
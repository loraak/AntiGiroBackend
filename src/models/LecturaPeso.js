const mongoose = require('mongoose'); 

const lecturaPesoSchema = new mongoose.Schema({ 
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
    peso: { 
        type: Number, 
        required: [true, 'Peso requerido'], 
        min: [0, 'El peso no puede ser negativo']
    }, 
    unidad: { 
        type: String, 
        default: 'kg', 
        enum: ['kg', 'g', 'lb']
    }
}, { 
    timestamps: true, 
    collection: 'lecturas_peso'
}); 

lecturaPesoSchema.index({id_contenedor: 1, timestamp: -1}); 

module.exports = mongoose.model('LecturaPeso', lecturaPesoSchema);
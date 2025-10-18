const mongoose = require('mongoose');

const lecturaSchema = new mongoose.Schema({
id_contenedor: {
    type: Number,
    required: [true, 'El ID del contenedor es requerido'],
    index: true 
},
timestamp: {
    type: Date,
    required: [true, 'El timestamp es requerido'],
    default: Date.now,
    index: true
},
peso: {
    type: Number,
    required: [true, 'El peso es requerido'],
    min: [0, 'El peso no puede ser negativo']
},
nivel: {
    type: Number,
    required: [true, 'El nivel es requerido'],
    min: [0, 'El nivel no puede ser negativo'],
    max: [100, 'El nivel no puede ser mayor a 100']
},
estado_electroiman: {
    type: Boolean,
    required: [true, 'El estado del electroimán es requerido'],
    default: false
},
alerta: {
    tipo: {
        type: String,
        enum: ['llenado', 'sobrepeso', 'sensor_error', null]
    },
    mensaje: String,
    activo: {
        type: Boolean,
        default: false
    }
}
}, {
    timestamps: false,
    collection: 'lecturas'
});

lecturaSchema.index({ id_contenedor: 1, timestamp: -1 });

module.exports = mongoose.model('Lectura', lecturaSchema);
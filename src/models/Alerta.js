const mongoose = require('mongoose'); 

const alertaSchema = new mongoose.Schema({
    id_contenedor: { 
        type: Number, 
        required: [true, 'ID requerido'], 
        index: true 
    }, 
    tipo: { 
        type: String, 
        required: [true, 'Tipo de alerta requerida'], 
        enum: ['llenado', 'sobrepeso', 'sensor_error', 'mantenimiento', 'bateria_baja', 'temperatura'], 
        index: true 
    }, 
    severidad: { 
        type: String, 
        required: true, 
        enum: ['info', 'warning', 'critical'], 
        default: 'warning'
    }, 
    mensaje: { 
        type: String, 
        required: false
    }, 
    activo: { 
        type: Boolean, 
        required: true, 
        default: true, 
        index: true 
    }, 
    timestamp_inicio: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        index: true 
    }, 
    datos_relacionados: { 
        peso_actual: Number, 
        nivel_actual: Number, 
        umbral_excedido: Number, 
        codigo_error: String 
    }
}, { 
    timestamps: true, 
    collection: 'alertas'
}); 

alertaSchema.index({ id_contenedor: 1, activo: 1, timestamp_inicio: -1 }); 
alertaSchema.index({ activo: 1, severidad: 1, timestamp_inicio: -1 }); 
alertaSchema.index({ id_contenedor: 1, tipo: 1, activo: 1 });

alertaSchema.statics.getActivas = function(id_contenedor = null) {
    const query = { activo: true };
    if (id_contenedor) {
        query.id_contenedor = id_contenedor;
    }
    return this.find(query).sort({ timestamp_inicio: -1 }).lean();
};

alertaSchema.statics.getPorTipoYContenedor = function(id_contenedor, tipo, activo = true) {
    return this.findOne({ 
        id_contenedor, 
        tipo, 
        activo 
    }).sort({ timestamp_inicio: -1 }).lean();
};

alertaSchema.statics.contarPorSeveridad = async function() {
    return await this.aggregate([
        { $match: { activo: true } },
        { $group: { 
            _id: '$severidad', 
            cantidad: { $sum: 1 } 
        }}
    ]);
};

module.exports = mongoose.model('Alerta', alertaSchema);
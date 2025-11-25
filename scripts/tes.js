const mongoose = require('mongoose');
const LecturaNivel = require('../src/models/LecturaNivel');
const LecturaPeso = require('../src/models/LecturaPeso');

mongoose.connect('TU_MONGO_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function test() {
    try {
        console.log('🔍 Probando consultas...\n');
        
        // Total de documentos
        const totalNiveles = await LecturaNivel.countDocuments({});
        const totalPesos = await LecturaPeso.countDocuments({});
        console.log(`📊 Total lecturas_nivel: ${totalNiveles}`);
        console.log(`⚖️ Total lecturas_peso: ${totalPesos}\n`);
        
        // IDs disponibles
        const idsNivel = await LecturaNivel.distinct('id_contenedor');
        const idsPeso = await LecturaPeso.distinct('id_contenedor');
        console.log('IDs en lecturas_nivel:', idsNivel);
        console.log('IDs en lecturas_peso:', idsPeso, '\n');
        
        // Buscar con id_contenedor: 1
        const nivelConId1 = await LecturaNivel.findOne({ id_contenedor: 1 });
        const pesoConId1 = await LecturaPeso.findOne({ id_contenedor: 1 });
        console.log('¿Hay nivel con id 1?', nivelConId1 ? '✅ SÍ' : '❌ NO');
        console.log('¿Hay peso con id 1?', pesoConId1 ? '✅ SÍ' : '❌ NO');
        
        if (nivelConId1) console.log('Ejemplo nivel:', nivelConId1);
        if (pesoConId1) console.log('Ejemplo peso:', pesoConId1);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

test();
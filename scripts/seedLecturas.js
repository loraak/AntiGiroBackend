require('dotenv').config();
const mongoose = require('mongoose');
const Lectura = require('../src/models/Lectura');

async function seedLecturas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simbi_iot');
    console.log('Conectado a MongoDB');

    // Limpiar lecturas existentes (opcional)
    // await Lectura.deleteMany({});

    // Crear lecturas de prueba para contenedor 1
    const lecturasPrueba = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now - i * 30 * 60 * 1000); // Cada 30 minutos
      const peso = (Math.random() * 3 + 1).toFixed(2); // Entre 1 y 4 kg
      const nivel = (parseFloat(peso) / 5 * 100).toFixed(2); // Basado en peso_maximo de 5kg

    const lectura = {
        id_contenedor: 1,
        timestamp,
        peso: parseFloat(peso),
        nivel: parseFloat(nivel),
        estado_electroiman: Math.random() > 0.5,
    };

    // Agregar alerta si el nivel es alto
    if (lectura.nivel > 80) {
        lectura.alerta = {
            tipo: 'llenado',
            mensaje: 'Contenedor cerca del límite de capacidad',
            activo: true
    };
    }

    lecturasPrueba.push(lectura);
    }

    await Lectura.insertMany(lecturasPrueba);
    
    console.log(`${lecturasPrueba.length} lecturas de prueba creadas`);
    console.log('GET http://localhost:3000/api/lecturas/contenedor/1');
    
} catch (error) {
    console.error('Error:', error.message);
} finally {
    await mongoose.connection.close();
}
}

seedLecturas();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "SIMBI_iot";

let db;

async function connectDB() {
  if (!db) {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db(DB_NAME);
  }
  return db;
}

const dataController = {
  async obtenerDatosHistoricos(req, res) {
    try {
      const { containerId } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      
      const containerIdNum = parseInt(containerId);
      
      const database = await connectDB();
      
      const pesos = await database.collection('lecturas_peso')
        .find({ id_contenedor: containerIdNum })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      const niveles = await database.collection('lecturas_nivel')
        .find({ id_contenedor: containerIdNum })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      const combined = pesos.map((peso, i) => ({
        timestamp: peso.timestamp,
        peso: peso.peso,
        nivel: niveles[i]?.nivel || 0,
        peso_suave: peso.peso,
        nivel_suave: niveles[i]?.nivel || 0
      }));
      
      res.json({
        success: true,
        data: combined.reverse()
      });
      
    } catch (error) {
      console.error('Error al obtener datos históricos:', error);
      res.status(500).json({ error: 'Error al obtener datos' });
    }
  }
};

const predictionController = {
  async guardarPrediccion(req, res) {
    try {
      const { id_contenedor, prediccion_peso, modelo, estado, decision_auditable } = req.body;
      
      const database = await connectDB();
      
      const registro = {
        timestamp_registro: new Date(),
        id_contenedor: parseInt(id_contenedor),
        prediccion_peso,
        modelo,
        estado,
        decision_auditable
      };
      
      await database.collection('predicciones_trazabilidad').insertOne(registro);
      
      res.json({
        success: true,
        data: registro
      });
      
    } catch (error) {
      console.error('Error al guardar predicción:', error);
      res.status(500).json({ error: 'Error al guardar predicción' });
    }
  },

  async obtenerHistorial(req, res) {
    try {
      const { containerId } = req.params;
      const containerIdNum = parseInt(containerId);
      
      const database = await connectDB();
      
      const historial = await database.collection('predicciones_trazabilidad')
        .find({ id_contenedor: containerIdNum })
        .sort({ timestamp_registro: -1 })
        .limit(50)
        .toArray();
      
      res.json({
        success: true,
        data: historial
      });
      
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ error: 'Error al obtener historial' });
    }
  }
}

module.exports = { dataController, predictionController };
// src/routes/predictionRoutes.js
const express = require('express');
const router = express.Router();
const { dataController, predictionController } = require('../controllers/dataController');
const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Prediccion:
 *       type: object
 *       properties:
 *         id_contenedor:
 *           type: string
 *           example: "C1"
 *         prediccion_peso:
 *           type: number
 *           example: 0.1234
 *         modelo:
 *           type: string
 *           example: "LSTM_opt_v3_cyclic_browser"
 *         estado:
 *           type: string
 *           example: "Ritmo Normal / Mantenimiento"
 *         decision_auditable:
 *           type: string
 *           example: "Monitoreo Estándar. Ritmo normal."
 *         timestamp_registro:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Predicciones
 *   description: Predicciones de llenado con modelo LSTM
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/predictions/data/historical/{containerId}:
 *   get:
 *     summary: Obtener datos históricos para predicción
 *     tags: [Predicciones]
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contenedor
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Número de lecturas a obtener
 *     responses:
 *       200:
 *         description: Datos históricos consolidados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       peso:
 *                         type: number
 *                       nivel:
 *                         type: number
 *                       peso_suave:
 *                         type: number
 *                       nivel_suave:
 *                         type: number
 *       500:
 *         description: Error al obtener datos
 */
router.get('/data/historical/:containerId', dataController.obtenerDatosHistoricos);

/**
 * @swagger
 * /api/predictions/save:
 *   post:
 *     summary: Guardar una predicción
 *     tags: [Predicciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_contenedor
 *               - prediccion_peso
 *               - modelo
 *               - estado
 *               - decision_auditable
 *             properties:
 *               id_contenedor:
 *                 type: string
 *                 example: "C1"
 *               prediccion_peso:
 *                 type: number
 *                 example: 0.1234
 *               modelo:
 *                 type: string
 *                 example: "LSTM_opt_v3_cyclic_browser"
 *               estado:
 *                 type: string
 *                 example: "Ritmo Normal / Mantenimiento"
 *               decision_auditable:
 *                 type: string
 *                 example: "Monitoreo Estándar. Ritmo normal."
 *     responses:
 *       200:
 *         description: Predicción guardada exitosamente
 *       500:
 *         description: Error al guardar predicción
 */
router.post('/save', predictionController.guardarPrediccion);

/**
 * @swagger
 * /api/predictions/history/{containerId}:
 *   get:
 *     summary: Obtener historial de predicciones
 *     tags: [Predicciones]
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contenedor
 *     responses:
 *       200:
 *         description: Historial de predicciones (últimas 50)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prediccion'
 *       500:
 *         description: Error al obtener historial
 */
router.get('/history/:containerId', predictionController.obtenerHistorial);

module.exports = router;
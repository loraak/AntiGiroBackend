const express = require('express');
const router = express.Router();
const sensoresController = require('../controllers/sensoresController');

/**
 * @swagger
 * tags:
 *   name: Sensores
 *   description: Endpoints para recibir datos de sensores IoT
 */

/**
 * @swagger
 * /api/sensores/lecturas/peso:
 *   post:
 *     summary: Recibir lectura de peso desde sensor
 *     tags: [Sensores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_contenedor
 *               - peso
 *             properties:
 *               id_contenedor:
 *                 type: integer
 *                 example: 1
 *               peso:
 *                 type: number
 *                 example: 45.5
 *               unidad:
 *                 type: string
 *                 enum: [kg, g, lb]
 *                 default: kg
 *     responses:
 *       201:
 *         description: Lectura guardada exitosamente
 */
router.post('/lecturas/peso', sensoresController.crearLecturaPeso);

/**
 * @swagger
 * /api/sensores/lecturas/nivel:
 *   post:
 *     summary: Recibir lectura de nivel desde sensor
 *     tags: [Sensores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_contenedor
 *               - nivel
 *             properties:
 *               id_contenedor:
 *                 type: integer
 *                 example: 1
 *               nivel:
 *                 type: number
 *                 example: 75.5
 *               distancia_cm:
 *                 type: number
 *                 example: 25
 *     responses:
 *       201:
 *         description: Lectura guardada exitosamente
 */
router.post('/lecturas/nivel', sensoresController.crearLecturaNivel);

/**
 * @swagger
 * /api/sensores/eventos/electroiman:
 *   post:
 *     summary: Recibir evento de electroimán
 *     tags: [Sensores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_contenedor
 *               - estado
 *               - accion
 *             properties:
 *               id_contenedor:
 *                 type: integer
 *                 example: 1
 *               estado:
 *                 type: boolean
 *                 example: true
 *               accion:
 *                 type: string
 *                 enum: [activacion, desactivacion]
 *     responses:
 *       201:
 *         description: Evento guardado exitosamente
 */
router.post('/eventos/electroiman', sensoresController.crearEventoElectroiman);

/**
 * @swagger
 * /api/sensores/alertas:
 *   post:
 *     summary: Registrar alerta del sistema
 *     tags: [Sensores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_contenedor
 *               - tipo
 *               - nivel
 *               - mensaje
 *               - activo
 *             properties:
 *               id_contenedor:
 *                 type: integer
 *                 example: 1
 *               tipo:
 *                 type: string
 *                 enum: [llenado, sobrepeso, sensor_error, mantenimiento, bateria_baja, temperatura]
 *               nivel:
 *                 type: string
 *                 enum: [info, warning, critical]
 *               mensaje:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Alerta registrada exitosamente
 */
router.post('/alertas', sensoresController.crearAlerta);

module.exports = router;
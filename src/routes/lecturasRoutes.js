const express = require('express');
const router = express.Router();
const lecturasController = require('../controllers/lecturasController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Lectura:
 *       type: object
 *       required:
 *         - id_contenedor
 *         - peso
 *         - nivel
 *         - estado_electroiman
 *       properties:
 *         id_contenedor:
 *           type: integer
 *           example: 1
 *         peso:
 *           type: number
 *           example: 3.5
 *         nivel:
 *           type: number
 *           example: 75.5
 *         estado_electroiman:
 *           type: boolean
 *           example: true
 *         alerta:
 *           type: object
 *           properties:
 *             tipo:
 *               type: string
 *               enum: [llenado, sobrepeso, sensor_error]
 *             mensaje:
 *               type: string
 *             activo:
 *               type: boolean
 */

/**
 * @swagger
 * tags:
 *   name: Lecturas
 *   description: Gestión de lecturas IoT
 */

/**
 * @swagger
 * /api/lecturas:
 *   get:
 *     summary: Obtener todas las lecturas (paginadas)
 *     tags: [Lecturas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: id_contenedor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de lecturas
 */
router.get('/', lecturasController.getAll);

/**
 * @swagger
 * /api/lecturas/alertas:
 *   get:
 *     summary: Obtener lecturas con alertas activas
 *     tags: [Lecturas]
 *     parameters:
 *       - in: query
 *         name: id_contenedor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de alertas
 */
router.get('/alertas', lecturasController.getAlertas);

/**
 * @swagger
 * /api/lecturas/contenedor/{id}:
 *   get:
 *     summary: Obtener lecturas de un contenedor específico
 *     tags: [Lecturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Lecturas del contenedor
 */
router.get('/contenedor/:id', lecturasController.getByContenedor);

/**
 * @swagger
 * /api/lecturas/contenedor/{id}/ultima:
 *   get:
 *     summary: Obtener última lectura de un contenedor
 *     tags: [Lecturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Última lectura
 *       404:
 *         description: No hay lecturas
 */
router.get('/contenedor/:id/ultima', lecturasController.getUltima);

/**
 * @swagger
 * /api/lecturas/contenedor/{id}/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de un contenedor
 *     tags: [Lecturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Estadísticas del contenedor
 */
router.get('/contenedor/:id/estadisticas', lecturasController.getEstadisticas);

/**
 * @swagger
 * /api/lecturas:
 *   post:
 *     summary: Crear nueva lectura (endpoint para IoT)
 *     tags: [Lecturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lectura'
 *     responses:
 *       201:
 *         description: Lectura creada
 *       400:
 *         description: Error de validación
 */
router.post('/', lecturasController.create);

module.exports = router;
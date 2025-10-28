const express = require('express');
const router = express.Router();
const contenedoresController = require('../controllers/contenedoresController');
const { verifyToken, isAdmin } = require('../middlewares/auth'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Contenedor:
 *       type: object
 *       required:
 *         - nombre
 *         - ubicacion
 *         - id_usuario
 *       properties:
 *         id_contenedor:
 *           type: integer
 *           description: ID auto-generado
 *         nombre:
 *           type: string
 *           example: Contenedor Principal
 *         ubicacion:
 *           type: string
 *           example: Incubadora La Esperanza
 *         peso_maximo:
 *           type: number
 *           default: 5.00
 *           example: 5.00
 *         nivel_alerta:
 *           type: number
 *           default: 80.00
 *           example: 80.00
 *         activo:
 *           type: boolean
 *           default: true
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         creado_en:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * tags:
 *   name: Contenedores
 *   description: Gestión de contenedores IoT
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/contenedores:
 *   get:
 *     summary: Obtener todos los contenedores activos
 *     tags: [Contenedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contenedores
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
 *                     $ref: '#/components/schemas/Contenedor'
 *       401:
 *         description: No autenticado
 */
router.get('/', contenedoresController.getAll);

/**
 * @swagger
 * /api/contenedores/{id}:
 *   get:
 *     summary: Obtener un contenedor por ID
 *     tags: [Contenedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contenedor encontrado
 *       404:
 *         description: Contenedor no encontrado
 */
router.get('/:id', contenedoresController.getById);

/**
 * @swagger
 * /api/contenedores:
 *   post:
 *     summary: Crear un nuevo contenedor (solo admin)
 *     tags: [Contenedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - ubicacion
 *               - id_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               peso_maximo:
 *                 type: number
 *               nivel_alerta:
 *                 type: number
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Contenedor creado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Se requieren permisos de admin
 */
router.post('/', isAdmin, contenedoresController.create);

/**
 * @swagger
 * /api/contenedores/{id}:
 *   put:
 *     summary: Actualizar un contenedor (solo admin)
 *     tags: [Contenedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               peso_maximo:
 *                 type: number
 *               nivel_alerta:
 *                 type: number
 *     responses:
 *       200:
 *         description: Contenedor actualizado
 *       404:
 *         description: Contenedor no encontrado
 */
router.put('/:id', isAdmin, contenedoresController.update);

/**
 * @swagger
 * /api/contenedores/{id}:
 *   delete:
 *     summary: Desactivar un contenedor (solo admin)
 *     tags: [Contenedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contenedor desactivado
 */
router.delete('/:id', isAdmin, contenedoresController.delete);

module.exports = router;
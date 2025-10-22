const express = require('express'); 
const router = express.Router(); 

const authRoutes = require('./authRoutes');
const lecturasRoutes = require('./lecturasRoutes');
const usuariosRoutes = require ('./usuariosRoutes'); 
const contenedoresRoutes = require ('./contenedoresRoutes'); 

router.use('/auth', authRoutes);
router.use('/lecturas', lecturasRoutes);
router.use('/usuarios', usuariosRoutes); 
router.use('/contenedores', contenedoresRoutes); 

module.exports = router;
const express = require('express'); 
const router = express.Router(); 

const authRoutes = require('./authRoutes');
const lecturasRoutes = require('./lecturasRoutes');
const usuariosRoutes = require ('./usuariosRoutes'); 

router.use('/auth', authRoutes);
router.use('/lecturas', lecturasRoutes);
router.use('/usuarios', usuariosRoutes)

module.exports = router;
const express = require('express'); 
const router = express.Router(); 

const authRoutes = require('./authRoutes');
const lecturasRoutes = require('./lecturasRoutes');
const usuariosRoutes = require ('./usuariosRoutes'); 
const contenedoresRoutes = require ('./contenedoresRoutes'); 
const sensoresRoutes = require ('./sensoresRoutes');

router.use('/auth', authRoutes);
router.use('/lecturas', lecturasRoutes);
router.use('/usuarios', usuariosRoutes); 
router.use('/contenedores', contenedoresRoutes); 
router.use('/sensores', sensoresRoutes);

module.exports = router;
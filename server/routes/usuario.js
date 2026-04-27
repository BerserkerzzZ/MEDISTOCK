const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');


router.post('/', usuarioController.crearUsuario);
router.get('/', usuarioController.listarUsuario);
router.get('/:id', usuarioController.obtenerUsuario);

module.exports = router;
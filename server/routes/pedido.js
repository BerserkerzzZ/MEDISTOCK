const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.crearPedido);
router.get('/cliente/:clienteId', pedidoController.obtenerPedidosCliente);
router.put('/logistica/:id', pedidoController.actualizarLogistica);
router.get('/', pedidoController.obtenerTodosLosPedidos); 

module.exports = router;
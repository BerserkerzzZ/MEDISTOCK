const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    articulos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto'
        },
        nombreP: String,
        cantidad: { type: Number, required: true },
        precioUnitario: { type: Number, required: true }
    }],

    total: {
        type: Number,
        required: true
    },

    pago: {
        estado: { 
            type: String, 
            enum: ['PENDIENTE', 'COMPLETADO', 'RECHAZADO'], 
            default: 'PENDIENTE' 
        },
        id_transaccion: String, 
        metodo_pago: String    
    },

    envio: {
        tipo: { 
            type: String, 
            enum: ['NORMAL', 'EXPRESS'], 
            required: true 
        },
        tracking_number: { type: String, default: '' }, 
        estado_entrega: {
            type: String,
            enum: ['PREPARACION', 'DESPACHADO', 'EN_CAMINO', 'ENTREGADO'],
            default: 'PREPARACION'
        },
        courier: { type: String, default: 'Simulador Logístico' }
    },

    fechaPedido: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pedido', PedidoSchema, 'pedidos');
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombreP: { 
        type: String, 
        required: true 
    },
    
    codigoBarra: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    stocks: [{
        bodega: { type: String, required: true }, // Ej: 'Santiago-Norte', 'Clinica-A'
        actual: { type: Number, required: true, default: 0 },
        minimo: { type: Number, default: 10 }
    }],

    isCritico: {
        type: Boolean,
        default: false
    },
    
    precioP: { 
        type: Number, 
        required: true 
    },
    
    descripcionP: { 
        type: String, 
        required: true 
    },

    categoria: {
        type: String,
        required: true,
        enum: ['Insumos', 'Medicamentos', 'Equipamiento', 'Urgencia']
    },
    
    imgP: {
        type: String, 
        required: true
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
});

productoSchema.virtual('totalStock').get(function() {
    return this.stocks.reduce((acc, b) => acc + b.actual, 0);
});

const Producto = mongoose.model('Producto', productoSchema, 'producto');

module.exports = Producto;
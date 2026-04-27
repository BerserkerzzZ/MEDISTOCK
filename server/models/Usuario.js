const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        enum: [
            'PACIENTE', 
            'INSTITUCION',
            'ADMINISTRADOR', 
            'EJECUTIVO', 
            'LOGISTICO', 
            'ANALISTA'
        ],
        default: 'PACIENTE'
    },
    rut_institucion: {
        type: String,
        required: function() { return this.rol === 'INSTITUCION'; }
    },
    direccion_despacho: {
        calle: String,
        comuna: String,
        ciudad: String
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
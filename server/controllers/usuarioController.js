const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
    const { email, password, rol } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        usuario = new Usuario(req.body);

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        res.json({ msg: 'Usuario creado correctamente', rol: usuario.rol });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al registrar el usuario');
    }
};

exports.listarUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
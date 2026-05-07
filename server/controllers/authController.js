import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/jwt';

export const login = async (req: Request, res: Response) => {
    const { email, clave } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({ ok: false, msg: 'Correo no encontrado' });
        }

        const validClave = bcrypt.compareSync(clave, usuarioDB.clave);
        if (!validClave) {
            return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            usuario: usuarioDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
};
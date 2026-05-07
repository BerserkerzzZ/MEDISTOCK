import jwt from 'jsonwebtoken';

export const generarJWT = (uid: string) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.JWT_SECRET || 'clave-secreta-de-medistock', {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};
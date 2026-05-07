export interface Direccion {
    calle?: string;
    comuna?: string;
    ciudad?: string;
}

export interface Usuario {
    _id?: string; // MongoDB usa _id
    nombre: string;
    email: string;
    rol: 'PACIENTE' | 'INSTITUCION' | 'ADMINISTRADOR' | 'EJECUTIVO' | 'LOGISTICO' | 'ANALISTA';
    rut_institucion?: string;
    direccion_despacho?: Direccion;
    fechaCreacion?: Date;
}

export interface AuthResponse {
    ok: boolean;
    token: string;
    usuario: Usuario;
    msg?: string;
}
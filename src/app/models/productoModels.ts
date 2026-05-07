export interface StockBodega {
    bodega: string;
    actual: number;
    minimo: number;
}

export type CategoriaProducto = 'Insumos' | 'Medicamentos' | 'Equipamiento' | 'Urgencia';

export interface Producto {
    _id?: string;
    nombreP: string;
    codigoBarra: string;
    stocks: StockBodega[];
    isCritico: boolean;
    precioP: number;
    descripcionP: string;
    categoria: CategoriaProducto;
    imgP: string;
    fechaActualizacion?: Date; 
    totalStock?: number;
}

export interface ProductoResponse {
    ok: boolean;
    productos: Producto[];
}
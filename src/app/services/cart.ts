import { Injectable } from '@angular/core';
import { Producto } from '../models/productoModels';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Producto[] = [];

  constructor() { }

  agregarProducto(producto: Producto) {
    this.cart.push(producto);
  }

  getCarrito() {
    return this.cart;
  }

  getMontoTotal(): number {
    return this.cart.reduce((total, p) => total + p.precioP, 0);
  }

  limpiarCarrito() {
    this.cart = [];
    return this.cart;
  }
}

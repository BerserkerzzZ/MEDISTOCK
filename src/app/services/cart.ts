import { Injectable } from '@angular/core';
import { Producto } from '../models/productoModels';

// estructura del carrito
export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];

  constructor() { }

//agregar unidades en el carrito
  agregarProducto(producto: Producto, stockMaximo: number) {
  const itemExistente = this.cart.find(item => item.producto._id === producto._id);

  if (itemExistente) {
// validar que el stock disponga de unidades
    if (itemExistente.cantidad >= stockMaximo) {
      console.warn('No hay más stock disponible en bodegas');
      return; 
    }
    itemExistente.cantidad += 1;
  } else {
    if (stockMaximo <= 0) return;
    this.cart.push({ producto, cantidad: 1 });
  }
}

incrementarCantidad(productoId: string, stockMaximo: number): boolean {
  const item = this.cart.find(item => item.producto._id === productoId);
  if (item) {
// valida que no agregue mas unidades de las disponibles
    if (item.cantidad < stockMaximo) {
      item.cantidad += 1;
      return true;
    }
  }
  return false;
}

  decrementarCantidad(productoId: string) {
    const item = this.cart.find(item => item.producto._id === productoId);
    if (item) {
      item.cantidad -= 1;
      
//quita el producto si la cantidad baja de 1
      if (item.cantidad <= 0) {
        this.eliminarProducto(productoId);
      }
    }
  }

  eliminarProducto(productoId: string) {
    this.cart = this.cart.filter(item => item.producto._id !== productoId);
  }

  getCarrito(): CartItem[] {
    return this.cart;
  }

  getMontoTotal(): number {
    return this.cart.reduce((total, item) => total + (item.producto.precioP * item.cantidad), 0);
  }

  limpiarCarrito() {
    this.cart = [];
    return this.cart;
  }
}
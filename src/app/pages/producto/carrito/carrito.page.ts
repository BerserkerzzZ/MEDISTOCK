import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartService, CartItem } from '../../../services/cart'; 
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../../services/payment';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class CarritoPage implements OnInit {

  items: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.items = this.cartService.getCarrito();
    this.total = this.cartService.getMontoTotal();
  }

  sumarUnidad(item: CartItem) {
    if (item.producto._id && item.producto.stocks) {
      const stockMaximo = item.producto.stocks.reduce((acc, b) => acc + b.actual, 0);
      
      const seIncremento = this.cartService.incrementarCantidad(item.producto._id, stockMaximo);
      
      if (!seIncremento) {
        alert(`Lo sentimos, no quedan más unidades disponibles de ${item.producto.nombreP}.`);
      }
      
      this.cargarCarrito();
    }
  }

  restarUnidad(item: CartItem) {
    if (item.producto._id) {
      this.cartService.decrementarCantidad(item.producto._id);
      this.cargarCarrito();
    }
  }

  eliminarDelCarrito(item: CartItem) {
    if (item.producto._id) {
      this.cartService.eliminarProducto(item.producto._id);
      this.cargarCarrito();
    }
  }

  alcanzoLimiteStock(item: CartItem): boolean {
    if (!item.producto.stocks) return false;
    const totalStock = item.producto.stocks.reduce((acc, b) => acc + b.actual, 0);
    return item.cantidad >= totalStock;
  }

  pagar() {
    if (this.total <= 0) return;

    const idUsuarioLogueado = localStorage.getItem('userId');

    if (!idUsuarioLogueado) {
      console.error('No se encontró el ID del usuario. Asegúrate de estar logueado.');
      alert('Debes iniciar sesión para finalizar la compra');
      return;
    }

    const datosPedido = {
      total: this.total,
      cliente: idUsuarioLogueado,
      envioTipo: 'NORMAL',
      articulos: this.items.map(item => ({
        producto: item.producto._id,
        nombreP: item.producto.nombreP,
        cantidad: item.cantidad, 
        precioUnitario: item.producto.precioP
      }))
    };

    console.log('Iniciando pago sincronizado para Medistock:', idUsuarioLogueado, datosPedido);

    this.paymentService.iniciarPago(datosPedido).subscribe({
      next: (res) => {
        if (res.url && res.token) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = res.url;

          const inputToken = document.createElement('input');
          inputToken.type = 'hidden';
          inputToken.name = 'token_ws';
          inputToken.value = res.token;

          form.appendChild(inputToken);
          document.body.appendChild(form);
          
          form.submit(); 
        }
      },
      error: (err) => {
        console.error('Error al conectar con la EC2 para procesar Webpay:', err);
        alert(err.error?.msg || 'Error al conectar con la pasarela de pago.');
      }
    });
  }
}
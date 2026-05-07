import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartService } from '../../../services/cart';
import { Producto } from '../../../models/productoModels';
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

  items: Producto[] = [];
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

  eliminarDelCarrito(index: number) {
    this.items.splice(index, 1);
    this.total = this.cartService.getMontoTotal();
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
      monto: this.total,
      clienteId: idUsuarioLogueado,
      tipoEnvio: 'NORMAL',
      articulos: this.items.map(p => ({
        producto: p._id,
        nombreP: p.nombreP,
        cantidad: 1, 
        precioUnitario: p.precioP
      }))
    };

    console.log('Iniciando pago para el usuario:', idUsuarioLogueado);

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
      }
    });
  }
}
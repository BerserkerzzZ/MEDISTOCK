import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto';
import { CartService } from '../../../services/cart';
import { Producto, StockBodega } from '../../../models/productoModels';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false,
})
export class CatalogoPage implements OnInit {

  productos: Producto[] = [];
  loading: boolean = true;

  constructor(
    private productoService: ProductoService,
    private cartService: CartService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('Error al conectar con AWS:', err);
        this.loading = false;
      }
    });
  }

  calcularStockTotal(stocks: StockBodega[]): number {
    return stocks.reduce((acc, b) => acc + b.actual, 0);
  }

  async agregarAlCarrito(producto: Producto) {
    this.cartService.agregarProducto(producto);
    
    const toast = await this.toastController.create({
      message: `${producto.nombreP} añadido al carrito`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}

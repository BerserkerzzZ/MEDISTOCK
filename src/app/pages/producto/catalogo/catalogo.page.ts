import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto';
import { CartService } from '../../../services/cart';
import { CurrencyService } from '../../../services/currency'; 
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

  divisas: any = { uf: 0, dolar: 0, euro: 0 };
  monedaSeleccionada: string = 'CLP';

  constructor(
    private productoService: ProductoService,
    private cartService: CartService,
    private currencyService: CurrencyService, 
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarProductos();
    this.cargarDivisas(); 
  }

  cargarProductos() {
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al conectar con AWS:', err);
        this.loading = false;
      }
    });
  }

  cargarDivisas() {
    this.currencyService.getValores().subscribe({
      next: (data) => {
        this.divisas = data;
        console.log('Tipos de cambio actualizados:', this.divisas);
      },
      error: (err) => {
        console.error('No se pudieron obtener las divisas:', err);
      }
    });
  }

  cambiarMoneda(event: any) {
    this.monedaSeleccionada = event.detail.value;
  }

  calcularStockTotal(stocks: StockBodega[]): number {
    return stocks.reduce((acc, b) => acc + b.actual, 0);
  }
//envia el stock disponible del producto
  async agregarAlCarrito(producto: Producto) {
    const stockDisponible = this.calcularStockTotal(producto.stocks);  
    this.cartService.agregarProducto(producto, stockDisponible);
    const itemEnCarro = this.cartService.getCarrito().find(i => i.producto._id === producto._id);
    
//error al superar el stock en el carrito
    if (itemEnCarro && itemEnCarro.cantidad >= stockDisponible) {
      const toast = await this.toastController.create({
        message: `Alcanzaste el límite de stock disponible para ${producto.nombreP}`,
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    const toast = await this.toastController.create({
      message: `${producto.nombreP} añadido al carrito`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
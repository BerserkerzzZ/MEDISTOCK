import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ProductoService } from '../../../services/producto';
import { Producto } from '../../../models/productoModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.page.html',
  styleUrls: ['./admin-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class AdminProductosPage implements OnInit {

  productos: Producto[] = [];
  
  // Estado del Modal
  isModalOpen = false;
  modoEdicion = false;
  
  // Inicialización del objeto siguiendo tu Interface
  nuevoProducto: Producto = this.limpiarFormulario();

  constructor(
    private productoService: ProductoService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  // --- LÓGICA DEL MODAL ---
  abrirModal(abrir: boolean, producto?: Producto) {
    this.isModalOpen = abrir;
    if (producto) {
      this.modoEdicion = true;
      // Usamos spread operator para no modificar el objeto de la lista original por referencia
      this.nuevoProducto = { ...producto }; 
      // Si por alguna razón el producto no tiene el arreglo de stocks, lo inicializamos
      if (!this.nuevoProducto.stocks) {
        this.nuevoProducto.stocks = [{ bodega: 'Central', actual: 0, minimo: 5 }];
      }
    } else {
      this.modoEdicion = false;
      this.nuevoProducto = this.limpiarFormulario();
    }
  }

  limpiarFormulario(): Producto {
    return {
      nombreP: '',
      codigoBarra: '',
      precioP: 0,
      descripcionP: '',
      categoria: 'Insumos',
      imgP: '',
      isCritico: false,
      stocks: [{ bodega: 'Central', actual: 0, minimo: 5 }]
    };
  }

  // --- CÁLCULOS PARA LA VISTA ---
  calcularTotalStock(producto: Producto): number {
    if (!producto.stocks || producto.stocks.length === 0) return 0;
    return producto.stocks.reduce((acc, b) => acc + b.actual, 0);
  }

  esStockBajo(producto: Producto): boolean {
    if (!producto.stocks) return false;
    // Retorna true si el actual es menor o igual al mínimo en cualquier bodega
    return producto.stocks.some(b => b.actual <= b.minimo);
  }

  // --- LLAMADAS A LA API (AWS EC2) ---
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (res: any) => {
        // Manejamos tanto si viene el array directo o dentro de la propiedad .productos
        this.productos = res.productos ? res.productos : res;
      },
      error: (err) => console.error('Error al conectar con el servidor:', err)
    });
  }

  guardarProducto() {
  // Validaciones básicas
  if (!this.nuevoProducto.nombreP || !this.nuevoProducto.codigoBarra) {
    this.mostrarToast('Por favor, completa los campos obligatorios', 'warning');
    return;
  }

  // --- LOGICA AUTOMÁTICA DE STOCK CRÍTICO ---
  // Calculamos si es crítico antes de enviar a la base de datos
  this.nuevoProducto.isCritico = this.esStockBajo(this.nuevoProducto);

  if (this.modoEdicion) {
    this.productoService.actualizarProducto(this.nuevoProducto._id!, this.nuevoProducto).subscribe({
      next: () => this.finalizarGuardado('Producto actualizado correctamente'),
      error: (err) => console.error('Error al actualizar:', err)
    });
  } else {
    this.productoService.crearProducto(this.nuevoProducto).subscribe({
      next: () => this.finalizarGuardado('Producto guardado en Medistock'),
      error: (err) => console.error('Error al crear:', err)
    });
  }
}

  private async finalizarGuardado(mensaje: string) {
    await this.mostrarToast(mensaje, 'success');
    this.abrirModal(false);
    this.cargarProductos();
  }

  async eliminarProducto(id: string) {
    this.productoService.eliminarProducto(id).subscribe({
      next: async () => {
        await this.mostrarToast('Producto eliminado del inventario', 'danger');
        this.cargarProductos();
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  // --- INTERFAZ DE USUARIO (ActionSheet y Alerts) ---
  async presentActionSheet(producto: Producto) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: producto.nombreP,
      subHeader: `Categoría: ${producto.categoria}`,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => this.abrirModal(true, producto)
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => this.confirmarEliminacion(producto)
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async confirmarEliminacion(producto: Producto) {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message: `¿Estás seguro de eliminar <strong>${producto.nombreP}</strong>?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        { 
          text: 'Sí, borrar', 
          handler: () => this.eliminarProducto(producto._id!) 
        }
      ]
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
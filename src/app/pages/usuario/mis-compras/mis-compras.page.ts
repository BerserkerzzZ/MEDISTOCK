import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 🔄 Importamos ChangeDetectorRef
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.page.html',
  styleUrls: ['./mis-compras.page.scss'],
  standalone: false,
})
export class MisComprasPage implements OnInit {

  pedidos: any[] = [];
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarHistorial();
  }

  ionViewWillEnter() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    const headers = new HttpHeaders({
      'x-auth-token': token || '',
      'ngrok-skip-browser-warning': 'true'
    });

    const urlHistorial = `${environment.baseUrl}/pedido/cliente/${userId}`;
    console.log('--> Consultando historial en Medistock:', urlHistorial);

    this.http.get<any[]>(urlHistorial, { headers })
      .subscribe({
        next: (res) => {
          if (res && Array.isArray(res) && res.length > 0) {
            this.pedidos = res.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
          } else {
            this.pedidos = [];
          }
          
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('--> Error en la petición de historial:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getBadgeColor(estado: string) {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADO': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'RECHAZADO': return 'danger';
      default: return 'medium';
    }
  }
}
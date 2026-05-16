import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {

  nombreUsuario: string = 'Bienvenido';
  esAdmin: boolean = false;
  estaLogueado: boolean = false;
  mostrarAlertLogout: boolean = false;

  alertButtons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Desconectarme',
      role: 'confirm',
      handler: () => {
        this.logout(); // Centralizamos el logout en una sola función
      }
    }
  ];

  constructor(
    private router: Router,
    private authService: Auth,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.verificarAutenticacion();
  }

  // Ejecutar al entrar a la vista para capturar cambios si el usuario vuelve a la Home
  ionViewWillEnter() {
    this.verificarAutenticacion();
  }

  verificarAutenticacion() {
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    this.esAdmin = (rol === 'ADMINISTRADOR');
    this.estaLogueado = !!token;

    if (token && userId) {
      this.obtenerNombreUsuario(userId, token);
    } else {
      this.nombreUsuario = 'Invitado'; // Mensaje amigable si no está logueado
    }
  }

  obtenerNombreUsuario(id: string, token: string) {
    const headers = new HttpHeaders({
      'x-auth-token': token,
      'ngrok-skip-browser-warning': 'true'
    });

    this.http.get<any>(`${environment.baseUrl}/usuarios/${id}`, { headers })
      .subscribe({
        next: (usuario) => {
          this.nombreUsuario = usuario.nombre || 'Usuario';
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);
          this.nombreUsuario = 'Usuario';
        }
      });
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  confirmarLogout() {
    this.mostrarAlertLogout = true;
  }

  logout() {
    this.authService.logout();
    this.estaLogueado = false; // Actualizamos el estado de la vista
    this.esAdmin = false;
    this.router.navigate(['/login']);
  }
}
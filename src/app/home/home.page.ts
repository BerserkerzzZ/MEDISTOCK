import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,]
})
export class HomePage implements OnInit {

  nombreUsuario: string = 'Usuario';
  esAdmin: boolean = false;

  constructor(private router: Router, private authService: Auth) {}

  ngOnInit() {
    // Recuperamos datos del localStorage guardados en el login
    const rol = localStorage.getItem('rol');
    this.esAdmin = (rol === 'ADMINISTRADOR');
    
    // Podrías recuperar el nombre si lo guardaste, o dejarlo genérico
    this.nombreUsuario = localStorage.getItem('userName') || 'Invitado';
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
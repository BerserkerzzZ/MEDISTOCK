import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false // O true si usas standalone components
})
export class RegistroPage {

  // Objeto basado en tu modelo Usuario + password para el backend
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'PACIENTE', // Valor por defecto
    rut_institucion: '',
    direccion_despacho: {
      calle: '',
      comuna: '',
      ciudad: ''
    }
  };

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  onRegister() {
    // Validación básica
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario creado:', res);
        alert('Registro exitoso. Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert(err.error.msg || 'Error al conectar con el servidor AWS');
      }
    });
  }
}
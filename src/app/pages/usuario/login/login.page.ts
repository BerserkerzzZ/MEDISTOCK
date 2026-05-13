import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onLogin() {
    const { email, password } = this.loginData;

    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log('Login exitoso!');

            // --- LÓGICA DE REDIRECCIÓN POR ROL ---
            // Accedemos al campo 'rol' y comparamos con 'ADMINISTRADOR'
            const resAny = res as any;
            const userRole = res.usuario?.rol || resAny.rol; 

            if (userRole === 'ADMINISTRADOR') {
              console.log('Redirigiendo a panel de administración');
              this.router.navigate(['/admin-productos']);
            } else {
              console.log('Redirigiendo a vista de usuario');
              this.router.navigate(['/home']);
            }
          }
        },
        error: (err) => {
          console.error('Error en el login', err);
          // Si el servidor de AWS no responde o hay error de credenciales
          alert(err.error.msg || 'Error de conexión con el servidor AWS');
        }
      });
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
}
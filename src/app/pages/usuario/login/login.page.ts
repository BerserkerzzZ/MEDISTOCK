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
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error('Error en el login', err);
          alert(err.error.msg || 'Error de conexión con el servidor AWS');
        }
      });
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
}
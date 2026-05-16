import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {

  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'PACIENTE', 
    rut: '',
    direccion_despacho: {
      calle: '',
      comuna: '',
      ciudad: ''
    }
  };

  constructor(
    private authService: Auth,
    private router: Router,
    private toastController: ToastController
  ) { }

  // Validar el formato del correo
  esEmailValido(email: string): boolean {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email);
  }

// modifica el rut
  formatearRut(event: any) {
    let value = event.detail.value.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
    
    if (value === '') {
      this.nuevoUsuario.rut = '';
      return;
    }

    let cuerpo = value.slice(0, -1);
    let dv = value.slice(-1);

    if (cuerpo.length > 0) {
      cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      this.nuevoUsuario.rut = `${cuerpo}-${dv}`;
    } else {
      this.nuevoUsuario.rut = dv;
    }
  }

// valida que el rut cumpla con la medida correcta
  esRutValido(rut: string): boolean {
    if (!rut || rut.trim() === '') return false; 
    
    let valor = rut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
    if (valor.length < 8) return false;

    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo.charAt(i));
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);

    return dv === dvCalc;
  }

// bloquea el formulario hasta que este listo
  formularioEstaListo(): boolean {
    const u = this.nuevoUsuario;
    
// marca los campos obligatorios
    const camposLlenos = u.nombre.trim() !== '' && 
                         u.email.trim() !== '' && 
                         u.password.trim() !== '' &&
                         u.rut.trim() !== '';
    
// valida el formato de los campos obligatorios
    const formatosValidos = this.esEmailValido(u.email) && 
                            u.password.length >= 6 && 
                            this.esRutValido(u.rut);

    return camposLlenos && formatosValidos;
  }

  onRegister() {
    if (!this.formularioEstaListo()) {
      this.mostrarToast('Por favor, corrige los errores del formulario antes de continuar.', 'warning');
      return;
    }

    console.log('Enviando datos validados hacia AWS Node.js:', this.nuevoUsuario);

    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario creado en MongoDB:', res);
        this.mostrarToast('¡Registro exitoso! Ya puedes iniciar sesión en Medistock.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        const mensajeError = err.error?.msg || 'Error al conectar con el servidor AWS';
        this.mostrarToast(mensajeError, 'danger');
      }
    });
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
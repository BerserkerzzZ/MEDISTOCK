import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async canActivate(): Promise<boolean> {
    const userRole = localStorage.getItem('rol'); 

    if (userRole === 'ADMINISTRADOR') {
      return true;
    } else {
      await this.mostrarMensajeError();
      
      this.router.navigate(['/home']);
      return false;
    }
  }

  private async mostrarMensajeError() {
    const toast = await this.toastCtrl.create({
      message: 'Acceso denegado: Se requieren permisos de administrador.',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
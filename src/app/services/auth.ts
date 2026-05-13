import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../models/usuarioModels';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = environment.baseUrl; 

  constructor(private http: HttpClient) { }

  // --- LOGIN ---
  login(email: string, password: string): Observable<AuthResponse> {
    const data = { email, password };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      map(res => {
        if (res.ok && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.usuario.rol);
          localStorage.setItem('userId', res.usuario._id || '');
        }
        return res;
      })
    );
  }

  // --- REGISTRO ---
  // Conecta con exports.crearUsuario de tu controlador en Node.js
  registrar(usuario: any): Observable<any> {
    // La ruta debe coincidir con tu router de Express (ej: /api/usuarios/crear)
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario);
  }

  // --- LOGOUT ---
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
  }

  // --- UTILIDADES ---
  // Método extra para verificar el rol rápidamente en los Guards
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }
}
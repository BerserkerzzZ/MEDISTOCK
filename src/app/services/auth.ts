import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 1. Agregamos HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../models/usuarioModels';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = environment.baseUrl; 

  // 2. Definimos las opciones con el header mágico de ngrok
  private httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  // --- LOGIN ---
  login(email: string, password: string): Observable<AuthResponse> {
    const data = { email, password };
    
    // 3. Pasamos this.httpOptions como tercer argumento
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data, this.httpOptions).pipe(
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
  registrar(usuario: any): Observable<any> {
    // 3. También lo agregamos aquí
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario, this.httpOptions);
  }

  // --- LOGOUT ---
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
  }

  // --- UTILIDADES ---
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }
}
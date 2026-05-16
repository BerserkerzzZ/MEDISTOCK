import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../models/usuarioModels';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = environment.baseUrl; 

// para evitar errores de ngrok
  private httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponse> {
    const data = { email, password };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data, this.httpOptions).pipe(
      map(res => {
        if (res.ok && res.token) {
// guardamos token, rol y userId
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.usuario.rol);
          localStorage.setItem('userId', res.usuario._id || '');
        }
        return res;
      })
    );
  }

  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario, this.httpOptions);
  }

// remueve token, rol y userId del local
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
  }

//guarda el rol en local
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }
}
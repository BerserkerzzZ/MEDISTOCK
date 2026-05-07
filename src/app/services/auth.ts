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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }
}
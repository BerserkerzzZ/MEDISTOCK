import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../models/productoModels';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.baseUrl}/productos`;

// para evitar errores de ngrok
  private httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, this.httpOptions);
  }

  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto, this.httpOptions);
  }

  actualizarProducto(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, this.httpOptions);
  }

  eliminarProducto(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 1. Agrega HttpHeaders
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.baseUrl}/webpay`;

  // 2. Definimos las opciones con el header de ngrok
  private httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  iniciarPago(datosPedido: any): Observable<any> {
    // 3. Pasamos los headers en el post
    return this.http.post(`${this.apiUrl}/iniciar`, datosPedido, this.httpOptions);
  }
}
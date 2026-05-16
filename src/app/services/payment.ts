import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.baseUrl}/webpay`;

// para evitar errores de ngrok
  private httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  iniciarPago(datosPedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, datosPedido, this.httpOptions);
  }
}
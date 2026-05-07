import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.baseUrl}/webpay`;

  constructor(private http: HttpClient) { }

  iniciarPago(datosPedido: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/iniciar`, datosPedido);
  }
}

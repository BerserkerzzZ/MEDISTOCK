import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private apiUrl = `${environment.baseUrl}/indicadores`;

  constructor(private http: HttpClient) {}

  getValores(): Observable<any> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    
    return this.http.get<any>(this.apiUrl, { headers });
  }
}

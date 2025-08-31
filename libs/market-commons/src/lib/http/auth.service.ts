import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'apps/market/src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ITokenResponse } from '../models/user.model';

@Injectable()
export class AuthService {

  private readonly apiBase = environment.apiURL;
  private readonly http = inject(HttpClient);
  private readonly handler = inject(HttpBackend);

  constructor() {
    // Estas consultas http no pasarán por el HttpInterceptor
    this.http = new HttpClient(this.handler);
  }

  signIn(body: { username: string, password: string }): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(`${this.apiBase}/auth/token`, body)
      .pipe(
        catchError((err) => {
          if (!err.status) {
            err.error = 'Error desconocido asociado a la red';
          }

          return throwError(() => err);
        })
      );
  }

  refreshToken(refreshToken: string): Observable<ITokenResponse> {
    const userData = new HttpParams()
      .set('refresh_token', refreshToken);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<ITokenResponse>(`${this.apiBase}/auth/refresh-token`, userData.toString(), { headers });
  }

  recovery(username: string): Observable<any> {
    const userData = new HttpParams()
      .set('user_id', username);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(`${this.apiBase}/auth/recovery-password`, userData.toString(), { headers });
  }

}

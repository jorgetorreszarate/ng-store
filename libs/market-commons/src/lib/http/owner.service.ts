import { HttpBackend, HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "apps/market/src/environments/environment";
import { Observable, catchError, map, throwError } from "rxjs";
import { ISunatResponse } from "../interfaces/sunat.interface";

@Injectable()
export class OwnerService {

  private readonly apiBase = `${environment.apiURL}`;
  private readonly http = inject(HttpClient);
  private readonly handler = inject(HttpBackend);

  getAll(request?: any): Observable<any[]> {
    const params = new HttpParams()
      .set('type', request?.type || '')
      .set('param_type', request?.param_type || '')
      .set('param_text', request?.param_text || '');

    return this.http.get<any[]>(`${this.apiBase}/owners?${params.toString()}`);
  }

  getByPage(request?: any): Observable<any> {
    const params = new HttpParams()
      .set('size_page', request?.size_page || 10)
      .set('page', request?.page || 1)
      .set('type', request?.type || '')
      .set('param_type', request?.param_type || '')
      .set('param_text', request?.param_text || '');

    return this.http.get<any>(`${this.apiBase}/owners/search?${params.toString()}`);
  }

  byId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/owners/${id}`);
  }

  register(owner: any): Observable<number> {
    return this.http.post<number>(`${this.apiBase}/owners`, owner);
  }

  getDataByDocument(documentType: number, documentValue: string): Observable<ISunatResponse | null> {
    const params = new HttpParams()
      .set('documentType', documentType == 1 ? 'dni' : 'ruc')
      .set('documentValue', documentValue);

    return this.http.get<any>(`${this.apiBase}/owners/external-api?${params.toString()}`)
      .pipe(
        map(res => {
          return {
            RazonSocial: res.razonSocial || `${res.nombres} ${res.apellidoPaterno} ${res.apellidoMaterno}`,
            IdUbigeo: res.ubigeo || '',
            Direccion: res.direccion ? `${res.direccion} ${res.distrito} - ${res.provincia} - ${res.departamento}` : '',
            Condicion: res.condicion || '',
            Estado: res.estado || ''
          } as ISunatResponse
        }),
        catchError(err => {
          const error = new HttpErrorResponse({
            ...err,
            error: err.error?.message || 'Hubo un error al consultar el documento'            
          });

          return throwError(() => error);
        })
      );
  }

}

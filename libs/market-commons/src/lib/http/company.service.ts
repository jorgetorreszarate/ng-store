import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "apps/market/src/environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class CompanyService {

  private readonly apiBase = `${environment.apiURL}`;
  private readonly http = inject(HttpClient);

  companies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/companies`);
  }

  get(companyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/companies/${companyId}`)
      .pipe(
        map(
          res => {
            if (res.ImagenUrl) {
              res.ImagenUrl = `${environment.apiURL}${res.ImagenUrl}?v=${Date.now()}`;
            }

            return res;
          }
        )
      );
  }

  register(company: any): Observable<any> {
    const formData = new FormData();
    formData.append('certificate', company.Certificado);
    formData.append('logo', company.Logo);

    delete company.Certificado;
    delete company.Logo;

    formData.append('company', JSON.stringify(company));
    return this.http.post<any>(`${this.apiBase}/companies`, formData);
  }

  downloadCertificate(filename: string): Observable<any> {
    const params = new HttpParams()
      .set('filename', filename);

    const headers = new HttpHeaders()
      .set('Accept', 'application/octet-stream');

    return this.http.get<any>(`${this.apiBase}/companies/certificate`,
      {
        headers,
        params,
        responseType: 'blob' as any,
        observe: 'events',
        reportProgress: true
      });
  }

  removeImagen(company_doc: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBase}/companies/logo/${company_doc}`);
  }

  numeration(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBase}/billing/numeration`);
  }

  numerationRegister(numeration: any[]): Observable<number> {
    return this.http.post<number>(`${this.apiBase}/billing/numeration-register`, numeration);
  }  

}
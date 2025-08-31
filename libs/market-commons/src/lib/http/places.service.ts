import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "apps/market/src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class PlaceService {

  private readonly apiBase = `${environment.apiURL}/places`;
  private readonly http = inject(HttpClient);

  departaments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/departaments`);
  }

  provinces(departament_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/provinces/${departament_id}`);
  }

  districts(province_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/districts/${province_id}`);
  }

  location(ubigeo_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/location/${ubigeo_id}`);
  }

  locations(text?: string): Observable<any[]> {
    const params = new HttpParams()
      .set('texto', text || '');

    return this.http.get<any[]>(`${this.apiBase}/locations`, { params });
  }

}

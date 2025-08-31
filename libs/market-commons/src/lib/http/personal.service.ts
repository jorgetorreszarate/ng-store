import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "apps/market/src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class PersonalService {

  private readonly apiBase = `${environment.apiURL}/personal`;
  private readonly http = inject(HttpClient);

  search(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/search?value=${name}`);
  }

  byID(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${id}`);
  }

  register(person: any): Observable<number> {
    return this.http.post<number>(this.apiBase, person);
  }

  remove(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiBase}/${id}`);
  }

}
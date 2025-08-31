import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "apps/market/src/environments/environment";
import { Observable, catchError, of } from "rxjs";
import { ISetting } from "../interfaces/settings.interface";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly apiBase = `${environment.apiURL}`;
  private readonly http = inject(HttpClient);

  getSettings(): Observable<ISetting> {
    return this.http.get<ISetting>(`${this.apiBase}/companies/configuration`)
      .pipe(
        catchError(() => of({} as ISetting))
      );
  }
}
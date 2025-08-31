import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "apps/market/src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class UserService {

  private readonly apiBase = `${environment.apiURL}/users`;
  private readonly http = inject(HttpClient);

  roles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/roles`);
  }

  usersByPersonal(personalId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/by-personal/${personalId}`);
  }

  user(userId: string): Observable<any> {
    const params = new HttpParams()
      .set('user_id', userId);

    return this.http.get<any>(`${this.apiBase}?${params.toString()}`);
  }

  save(user: any, isNew: boolean): Observable<any> {
    if (isNew) {
      return this.http.post<any>(this.apiBase, user);
    }

    if (!user?.userId) {
      throw new Error("User ID is required for update.");
    }

    return this.http.put<any>(this.apiBase, user);
  }

  changePassword(user: any): Observable<any> {
    return this.http.patch<any>(`${this.apiBase}/update-password`, user);
  }

  remove(userId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('userId', userId);

    return this.http.delete<any>(`${this.apiBase}?${params.toString()}`);
  }

}
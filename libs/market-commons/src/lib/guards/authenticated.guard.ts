import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../http/auth.service';
import { SessionService } from '../services/session.service';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = session.token;

  const goToLogin = (returnUrl: string): void => {
    router.navigate(['/auth/sign-in'], { queryParams: { returnUrl } });
  }

  // Si no existe un token o ha vencido
  if (!token) {
    const refresh_token = session.dataStorage?.refresh_token;

    if (!refresh_token) {
      goToLogin(state.url);
      return false;
    };

    return authService.refreshToken(refresh_token)
      .pipe(
        tap(token => {
          if (token?.access_token) {
            session.create(token);
          }
        }),
        catchError(() => {
          // Si ocurre un error en el refresh_token lo enviamos al inicio de sesion
          goToLogin(state.url);

          return of(false);
        }),
        switchMap(token => of(!!token))
      )
  }

  return !!token;
}

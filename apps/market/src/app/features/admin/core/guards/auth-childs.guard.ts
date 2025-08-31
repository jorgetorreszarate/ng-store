import { LoginComponent } from "@admin-core/components/commons";
import { BsModalService } from "@admin-core/services/bs-modal.service";
import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService, SessionService } from "@market-commons";
import { catchError, of, switchMap, tap } from "rxjs";

/**
 * Este guard se usa para vigilar que cuando se pase de una ruta a otra se tenga el token vigente,
 * caso contrario muestra un modal de login al usuario
 * @returns boolean
 */
export const AuthChildsGuard: CanActivateChildFn = (route, state) => {
  const bsModal = inject(BsModalService);
  const session = inject(SessionService);
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = session.token;
  if (!token) {
    const refresh_token = session.dataStorage?.refresh_token;

    if (!refresh_token) return false;

    return authService.refreshToken(refresh_token)
      .pipe(
        tap(token => {
          if (token?.access_token) session.create(token);
        }),
        catchError(() => {
          // Si ocurre un error en el refresh_token mostramos el modal de login
          bsModal.open(LoginComponent).then(res => {
            if (res) {
              router.navigateByUrl(state.url);
            }
          });

          return of(false);
        }),
        switchMap(token => of(!!token))
      )
  }

  return !!token;
}

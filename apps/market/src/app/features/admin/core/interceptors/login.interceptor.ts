import { LoginComponent } from '@admin-core/components/commons';
import { BsModalService } from '@admin-core/services';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

let show: boolean;

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const bsModal = inject(BsModalService);

  return next(req).pipe(
    catchError((error) => {
      if (!show &&
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        req.headers.has('x-auth-access')
      ) {
        show = true;
        bsModal.open(LoginComponent);

        // Para evitar que se desplieguen multiples ventanas de login
        setTimeout(() => show = false, 100);
      }

      return throwError(() => error);
    })
  );
}
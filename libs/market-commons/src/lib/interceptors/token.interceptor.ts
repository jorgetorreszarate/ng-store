import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../http/auth.service';
import { ITokenResponse } from '../models/user.model';
import { SessionService } from '../services/session.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const session = inject(SessionService);
	const authService = inject(AuthService);

	let request = req;

	// Verificamos el token del usuario que ha iniciado sesion
	const { token } = session;
	if (token) {
		request = addToken(req, token);
	}

	return next(request)
		.pipe(
			catchError(error => {
				// Si se venció la sesion, pedimos un nuevo token					
				if (error instanceof HttpErrorResponse && error.status === 401) {
					return handleAuthError(session, authService, request, next, error);
				} else {
					return throwError(() => error);
				}
			})
		);
}

function addToken(request: HttpRequest<any>, token: string) {
	return request.clone({
		headers: request.headers.set('Authorization', `Bearer ${token}`)
	});
}

function handleAuthError(
	session: SessionService,
	authService: AuthService,
	request: HttpRequest<any>,
	next: HttpHandlerFn,
	error: any
): Observable<any> {

	if (!isRefreshing) {
		isRefreshing = true;
		refreshTokenSubject.next(null);

		const { refresh_token } = session.dataStorage;
		if (!refresh_token) {
			return throwError(() => error);
		}

		return authService.refreshToken(refresh_token)
			.pipe(
				catchError(error => {
					// Si hay un error, quiere decir que venció el refresh_token, por tanto debemos mostrar/dirigir al login
					if (error instanceof HttpErrorResponse && error.status === 400) {
						// Un artificio para hacer de nuevo la llamada y pasar por el interceptor que muestra el login
						let req = request.clone({
							headers: request.headers.set('x-auth-access', 'on')
						});

						return next(req);
					}

					return throwError(() => error);
				}),
				switchMap((token: ITokenResponse) => {
					isRefreshing = false;

					const { access_token } = token;

					if (access_token) {
						refreshTokenSubject.next(token);

						// Asignamos el nuevo token
						session.create(token);
						return next(addToken(request, access_token));
					}

					return next(request);
				}),
			);
	} else {
		return refreshTokenSubject
			.pipe(
				take(1),
				switchMap(token => {
					isRefreshing = false;

					if (token) {
						session.create(token);
						return next(addToken(request, token.access_token));
					} else {
						return throwError(() => error);
					}
				})
			);
	}

	// return next(request);
}

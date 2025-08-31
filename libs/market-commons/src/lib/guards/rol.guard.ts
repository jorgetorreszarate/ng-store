import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const RolGuard: CanActivateFn = (route, state) => {
	const session = inject(SessionService);
	const router = inject(Router);

	const rols = route.data.rols;
	const hasRol = session.user.hasRole(rols);

	if (!hasRol) {
		router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
	}

	return hasRol;
}

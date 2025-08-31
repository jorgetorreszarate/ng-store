import { Routes } from "@angular/router";
import { RolGuard } from "@market-commons";
import { UserRol } from "@market/models";
import { ConfigurationComponent } from "./configuration.component";

export const routes: Routes = [
	{
		path: '',
		component: ConfigurationComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'usuarios' },
			{
				path: 'personal',
				title: 'Personal',
				canActivate: [RolGuard],
				data: { rols: [UserRol.admin] },
				loadComponent: () => import('./views/personal/personal.component').then(m => m.PersonalComponent)
			},
			{
				path: 'perfil',
				title: 'Perfil de usuario',
				loadChildren: () => import('./views/profile/profiles.routes').then(m => m.routes)
			},
			{
				path: 'empresa',
				title: 'Empresa',
				canActivate: [RolGuard],
				data: { rols: [UserRol.admin] },
				loadComponent: () => import('./views/company/company.component').then(m => m.CompanyComponent)
			},
			{
				path: 'general',
				title: 'Configuración general',
				canActivate: [RolGuard],
				data: { rols: [UserRol.admin] },
				loadComponent: () => import('./views/general/general.component').then(m => m.GeneralComponent)
			}
		]
	}
];

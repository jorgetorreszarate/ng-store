import { Route } from "@angular/router";
import { ProfileComponent } from "./profile.component";

export const routes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/profile-general/profile-general.component').then(m => m.ProfileGeneralComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./views/profile-users/profile-users.component').then(m => m.ProfileUsersComponent)
      }
    ]
  }
]
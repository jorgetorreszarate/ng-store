import { Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { SignInComponent } from "./views/sign-in/sign-in.component";

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        title: 'Iniciar sesión',
        component: SignInComponent
      }
    ]
  }
];
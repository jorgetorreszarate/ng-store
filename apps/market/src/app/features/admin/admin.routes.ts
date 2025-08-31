import { AuthChildsGuard } from "@admin-core/guards";
import { Routes } from "@angular/router";
import { SettingsResolver } from "@market-commons";
import { AdminComponent } from "./admin.component";

export const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivateChild: [AuthChildsGuard],
    // resolve: { config: SettingsResolver },
    children: [
      {
        path: "",
        pathMatch: "full",
        title: "Inicio",
        loadComponent: () => import("./views/dashboard/dashboard.component").then((m) => m.DashboardComponent),
      },
      {
        path: "configuracion",
        loadChildren: () => import("./views/configuration/configuration.routes").then((m) => m.routes),
      }
    ],
  },
];

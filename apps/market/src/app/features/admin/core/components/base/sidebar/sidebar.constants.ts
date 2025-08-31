import { ISidebarMenu } from "@admin-core/interfaces";
import { UserRol } from "@market/models";

export const menu_list: ISidebarMenu[] = [
  {
    title: "Inicio",
    icon: "bx-laptop",
    url: "/",
  },
  {
    title: "General",
    separator: true,
  },
  {
    title: "Menu",
    icon: "bx-credit-card-front",
    url: "/prueba",
    selected: false,
    children: [
      { title: "Sub Menú 1.1", url: "/prueba" },
      { title: "Sub Menú 1.2", url: "/prueba/sub-menu" }
    ],
  },
  {
    title: 'Sistema', separator: true, roles: [UserRol.admin]
  },
  {
    title: 'Configuración', icon: 'bx-cog', roles: [UserRol.admin],
    children: [
      { title: 'General', url: '/configuracion/general' },
      { title: 'Personal', url: '/configuracion/personal' },
      { title: 'Empresa', url: '/configuracion/empresa' }
    ]
  }
];

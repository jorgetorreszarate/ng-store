export interface ISidebarMenu {
  title: string;
  icon?: string;
  url?: string;
  params?: any;
  selected?: boolean;
  separator?: boolean;
  expand?: boolean;
  children?: ISidebarMenu[],
  roles?: string[]
}

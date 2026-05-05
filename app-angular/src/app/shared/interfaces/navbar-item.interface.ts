export interface NavbarItem {
  id: number;
  name: string;
  route: string;
  subItems?: NavbarItem[];
}

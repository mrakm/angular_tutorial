export interface SideNavItems {
  imgSrc: string;
  url: string;
  name: string;
  isConfiguration?: boolean;
  children?: Array<SideNavItems>;
  expanded?: boolean;
}

import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Starter',
    iconName: 'home',
    bgcolor: 'primary',
    route: '/starter',
  },
  {
    navCap: 'Other',
  },
  
  {
    displayName: 'Disabled',
    iconName: 'ban',
    route: '/disabled',
    bgcolor: 'accent',
    disabled: true,
  },
  {
    displayName: 'Chip',
    iconName: 'mood-smile',
    bgcolor: 'warning',
    route: '/',
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: '9',
  },
  {
    displayName: 'Outlined',
    iconName: 'mood-smile',
    bgcolor: 'success',
    route: '/',
    chip: true,
    chipClass: 'b-1 border-primary text-primary',
    chipContent: 'outlined',
  },
  {
    displayName: 'External Link',
    bgcolor: 'error',
    iconName: 'star',
    route: 'https://www.google.com/',
    external: true,
  },
];

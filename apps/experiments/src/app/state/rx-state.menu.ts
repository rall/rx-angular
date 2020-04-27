import { MenuItem } from '../core/navigation/menu-item.interface';

export const MENU_ITEMS: MenuItem[] = [
  {
    link: 'rx-base-state',
    label: 'RxState Overview',
    children: [
      {
        link: 'subscription',
        label: 'Subscription'
      },
      {
        link: 'composition',
        label: 'Composition'
      },
      {
        link: 'selections',
        label: 'Selections'
      },
      {
        link: 'connect',
        label: 'Connecting'
      },
      {
        link: 'get-imperative',
        label: 'Set Imperative'
      },
      {
        link: 'connect-reactive',
        label: 'Connect Reactively'
      },
      {
        link: 'select-reactive',
        label: 'Select Reactively'
      },
      {
        link: 'set-imperative',
        label: 'Get Imperative'
      }
    ]
  }
];

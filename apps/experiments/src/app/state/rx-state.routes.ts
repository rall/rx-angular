import { RxStateOverviewComponent } from './rx-state.overview.component';
import { RxStateParentSubscriptionComponent } from './subscription/parent.component';
import { RxStateParentSelectionsComponent } from './selections/parent.component';
import { RxStateParentCompositionComponent } from './composition/parent.component';
import { RxStateParentSubscriptionLessComponent } from './subscription-less-interaction/parent.component';
import { RxStateParentGetImperativeComponent } from './get-imperative/parent.component';
import { RxStateParentUpdateReactiveComponent } from './connect-reactive/parent.component';
import { RxStateParentSelectReactiveComponent } from './select-reactive/parent.component';
import { RxStateParentUpdateImperativeComponent } from './set-imperative/parent.component';

export const ROUTES = [
  {
    path: 'rx-base-state',
    component: RxStateOverviewComponent
  },
  {
    path: 'subscription',
    component: RxStateParentSubscriptionComponent
  },
  {
    path: 'composition',
    component: RxStateParentCompositionComponent
  },
  {
    path: 'selections',
    component: RxStateParentSelectionsComponent
  },
  {
    path: 'connect',
    component: RxStateParentSubscriptionLessComponent
  },
  {
    path: 'get-imperative',
    component: RxStateParentUpdateImperativeComponent
  },
  {
    path: 'connect-reactive',
    component: RxStateParentUpdateReactiveComponent
  },
  {
    path: 'select-reactive',
    component: RxStateParentSelectReactiveComponent
  },
  {
    path: 'set-imperative',
    component: RxStateParentGetImperativeComponent
  }
];

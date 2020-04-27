import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-rx-state-parent-get-reactive',
  template: `
    <h2>Get values imperatively</h2>
    <app-rx-state-child-get-imperative> </app-rx-state-child-get-imperative>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateParentGetImperativeComponent {}

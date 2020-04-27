import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-rx-state-parent-get-reactive',
  template: `
    <h2>Get values imperatively</h2>
    <label>Visible:</label>
    <input
      type="input"
      [ngModel]="value$ | async"
      (ngModelChange)="value$.next($event)"
    /><br />
    <app-rx-state-child-get-imperative [value]="value$ | async">
    </app-rx-state-child-get-imperative>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateParentGetImperativeComponent {
  value$ = new Subject();
}

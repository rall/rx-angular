import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-rx-state-parent-update-imperative',
  template: `
    <h2>Set values imperatively</h2>
    <label>Visible:</label>
    <input
      type="input"
      [ngModel]="value$ | async"
      (ngModelChange)="value$.next($event)"
    /><br />
    <app-rx-state-child-update-imperative [value]="value$ | async">
    </app-rx-state-child-update-imperative>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateParentUpdateImperativeComponent {
  value$ = new Subject();
}

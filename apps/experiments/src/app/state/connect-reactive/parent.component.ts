import { Component, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConnectableObservable, Subject, Subscription } from 'rxjs';
import { publishReplay, scan, shareReplay } from 'rxjs/operators';
import { SourceService } from './source.service';

@Component({
  selector: 'app-rx-state-parent-update-reactive',
  template: `
    <h2>Update values imperatively</h2>
    <label>Visible:</label>
    <input
      type="input"
      [ngModel]="input$ | async"
      (ngModelChange)="input$.next($event)"
    /><br />
    <app-rx-state-child-update-reactive [value]="input$ | async">
    </app-rx-state-child-update-reactive>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateParentUpdateReactiveComponent {
  input$ = new Subject();

  constructor(globalSource$: SourceService) {}
}

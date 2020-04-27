import { Component, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConnectableObservable, Subject, Subscription } from 'rxjs';
import { publishReplay, scan, shareReplay } from 'rxjs/operators';
import { SourceService } from './source.service';

@Component({
  selector: 'app-rx-state-parent-select-imperative',
  template: `
    <h2>Select values reactively</h2>
    <label>Visible:</label>
    <input
      type="input"
      [ngModel]="input$ | async"
      (ngModelChange)="input$.next($event)"
    /><br />
    <app-rx-state-child-select-reactive [value]="input$ | async">
    </app-rx-state-child-select-reactive>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateParentSelectReactiveComponent {
  input$ = new Subject();

  constructor(globalSource$: SourceService) {}
}

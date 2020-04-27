import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { scan } from 'rxjs/operators';
import { SourceService } from './source.service';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-rx-state-parent-get-imperative',
  template: `
    <h2>Child</h2>
    <div>
      Host binding class: {{ className$ | async }}
      <button (click)="toggleClass()">Toggle class</button>
    </div>
  `,
  styles: [
    `
      :host.red {
        color: red !important;
      }
      :host.green {
        color: green !important;
      }
    `
  ],
  changeDetection: environment.changeDetection
})
export class RxStateParentGetImperativeSolutionComponent extends RxState<{
  className: string;
}> {
  className$ = this.select('className');

  @HostBinding('class')
  get className() {
    return this.get()?.className;
  }

  toggleClass() {
    this.set(({ className }) => ({
      className: className === 'red' ? 'green' : 'red'
    }));
  }

  constructor() {
    super();
    this.set({ className: 'red' });
  }
}

import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RxState } from '@rx-angular/state';

interface ComponentState {
  value: number;
}

@Component({
  selector: 'app-rx-state-child-select-reactive',
  template: `
    <h2>Child</h2>
    <div>Input Binding: {{ value$ | async }}</div>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateChildSelectReactiveComponent extends RxState<
  ComponentState
> {
  value$ = this.select('value');
  @Input()
  set value(value: number) {
    this.set({ value });
  }
}

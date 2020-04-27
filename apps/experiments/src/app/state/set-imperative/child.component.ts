import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

interface ComponentState {
  value: number;
}

@Component({
  selector: 'app-rx-state-child-update-imperative',
  template: `
    <h2>Child</h2>
    <div>
      Input Binding: {{ _value }}

      <button (click)="updateValue()">Increment</button>
    </div>
  `,
  changeDetection: environment.changeDetection
})
export class RxStateChildSetImperativeComponent {
  _value = 0;
  @Input()
  set value(value: number) {
    this._value = value;
  }

  updateValue() {
    ++this._value;
  }
}

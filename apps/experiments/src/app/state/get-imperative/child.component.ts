import { Component, HostBinding, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-rx-state-child-get-imperative',
  template: `
    <h2>Child</h2>
    <div>
      Host binding class: {{ _class }}
      <button (click)="toggleClass()">Toggle class</button>
    </div>
  `,
  styles: [
    `
      :host.red h2,
      :host.red div {
        color: red !important;
      }
      :host.green {
        color: green !important;
      }
    `
  ]
})
export class RxStateChildGetImperativeComponent {
  _value = 0;
  @Input()
  set value(value: number) {
    this._value = value;
  }

  _class = 'red';
  @HostBinding('class')
  get class() {
    return this._class;
  }

  toggleClass() {
    this._class = this._class === 'red' ? 'green' : 'red';
  }
}

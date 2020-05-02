import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'demo-basics',
  template: `
    i$: {{ i$ | push }}
    <ng-container *rxLet="i$; let i">
      {{ i }}
    </ng-container>
    <ng-container *rxIf="i$; let i">
      {{ i }}
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoBasicsComponent {
  i$ = interval(200);
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import {
  ListServerItem,
  ListService
} from '../../../data-access/list-resource';
import {
  DemoBasicsItem,
  DemoBasicsViewModelService
} from './demo-basics.view-model.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-basics',
  templateUrl: './demo-basics.view-exact.html',
  // templateUrl: './demo-basics.-exact.html',
  styles: [
    `
      .list .mat-expansion-panel-header {
        position: relative;
      }
      .list .mat-expansion-panel-header mat-progress-bar {
        position: absolute;
        top: 0px;
        left: 0;
      }

      .list .mat-expansion-panel-content .mat-expansion-panel-body {
        padding-top: 10px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DemoBasicsViewModelService]
})
export class DemoBasicsComponent {
  /* START exact version */
  strategy = 'local';

  listExpanded$ = this.vm.select('listExpanded');
  list$ = this.vm.select('list');
  isPending$ = this.vm.select('isPending');
  refreshInterval$ = this.vm.select('refreshInterval');
  /* START exact version */

  @Input()
  set refreshInterval(refreshInterval: number) {
    if (refreshInterval > 4000 && refreshInterval < 10000) {
      this.vm.set({ refreshInterval });
    }
  }

  @Input()
  set refreshIntervalO(refreshInterval$: Observable<number>) {
    this.vm.connect(
      'refreshInterval',
      refreshInterval$.pipe(filter(ms => ms > 4000 && ms < 10000))
    );
  }

  numRenders = 0;
  rerenders(): number {
    return ++this.numRenders;
  }

  constructor(
    public vm: DemoBasicsViewModelService,
    private listService: ListService
  ) {
    this.vm.connect(
      'list',
      this.listService.list$.pipe(map(this.parseListItems))
    );
    this.vm.hold(
      this.vm.refreshListSideEffect$.pipe(
        tap(_ => this.listService.refetchList())
      )
    );
    this.vm.connect('isPending', this.listService.loadingSignal$);
  }

  parseListItems(l: ListServerItem[]): DemoBasicsItem[] {
    return l.map(({ id, name }) => ({ id, name }));
  }
}

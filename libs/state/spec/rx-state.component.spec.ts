import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { RxState } from '../src';
import { createStateChecker, PrimitiveState } from './fixtures';
import { Observable, Subject } from 'rxjs';
import { select } from '../src/lib/core/operators/select';

const stateChecker = createStateChecker((actual, expected) => {
  if (typeof expected === 'object') {
    expect(actual).toEqual(expected);
  } else {
    expect(actual).toBe(expected);
  }
});

@Component({
  selector: 'rx-angular-state-inheritance-test',
  template: `
    <span>{{ value$ }}</span>
  `
})
export class RxStateInheritanceComponent extends RxState<PrimitiveState> {
  value$ = this.select();

  constructor() {
    super();
  }
}

@Component({
  selector: 'rx-angular-state-local-provider-test',
  template: `
    <span>{{ (num$ | async) == null ? 'undefined' : (num$ | async) }}</span>
  `,
  providers: [RxState]
})
export class RxStateInjectionComponent {
  num$ = this.state.select();
  constructor(public state: RxState<PrimitiveState>) {}
}

@Component({
  selector: 'rx-angular-state-glue-test',
  template: `
    <span id="child">{{
      (num$ | async) == null ? 'undefined' : (num$ | async)
    }}</span>
  `
})
export class RxStateGlueComponent extends RxState<{ num: number }> {
  num$ = this.select('num');
  @Input()
  set num(num: number) {
    this.set({ num });
  }

  @Input()
  set numO(num$: Observable<number>) {
    this.connect(num$);
  }

  @Output()
  numChange: Observable<number> = this.$.pipe(select('num'));

  constructor() {
    super();
    this.set({ num: 42 });
  }
}

@Component({
  selector: 'rx-angular-state-glue-container-test',
  template: `
    <span id="parent">{{
      (num$ | async) == null ? 'undefined' : (num$ | async)
    }}</span>
    <rx-angular-state-glue-test (numChange)="numChange$.next($event)">
    </rx-angular-state-glue-test>
  `
})
export class RxStateGlueContainerComponent extends RxState<PrimitiveState> {
  numChange$ = new Subject<number>();
  num$ = this.select('num');

  @ViewChild(RxStateGlueContainerComponent)
  child;

  constructor() {
    super();
    this.connect('num', this.numChange$);
  }
}

describe('LocalProviderTestComponent', () => {
  let component: RxStateInjectionComponent;
  let fixture: ComponentFixture<RxStateInjectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RxStateInjectionComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RxStateInjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    stateChecker.checkSubscriptions(component.state, 1);
  });
});

describe('InheritanceTestComponent', () => {
  let component: RxStateInheritanceComponent;
  let fixture: ComponentFixture<RxStateInheritanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RxStateInheritanceComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RxStateInheritanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    stateChecker.checkSubscriptions(component, 1);
    component.ngOnDestroy();
    stateChecker.checkSubscriptions(component, 0);
  });
});

describe('GlueTestComponent', () => {
  let parent: RxStateGlueContainerComponent;
  let child: RxStateGlueComponent;
  let parentFixture: ComponentFixture<RxStateGlueContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RxStateGlueComponent, RxStateGlueContainerComponent]
    }).compileComponents();
    parentFixture = TestBed.createComponent(RxStateGlueContainerComponent);
    parentFixture.detectChanges();

    parent = parentFixture.componentInstance;
    child = parentFixture.componentInstance.child;
  });

  it('should create', () => {
    stateChecker.checkSubscriptions(parent, 1);
    parent.ngOnDestroy();
    stateChecker.checkSubscriptions(parent, 0);
  });

  it('should work with output  initial', () => {
    parentFixture.detectChanges();
    const containerValue = parentFixture.nativeElement.querySelector('#parent')
      .innerHTML;
    const childValue = parentFixture.nativeElement.querySelector('#child')
      .innerHTML;

    expect(containerValue).toBe('undefined');
    expect(childValue).toBe('42');
  });

  it('should work with output changes', () => {
    parentFixture.detectChanges();
    const containerValue = parentFixture.nativeElement.querySelector('#parent')
      .innerHTML;
    const childValue = parentFixture.nativeElement.querySelector('#child')
      .innerHTML;

    expect(containerValue).toBe('undefined');
    expect(childValue).toBe('42');

    child.set({ num: 777 });

    parentFixture.detectChanges();
    expect(containerValue).toBe('777');
    expect(childValue).toBe('777');
  });
});

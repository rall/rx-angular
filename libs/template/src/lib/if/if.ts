/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  ɵstringify as stringify
} from '@angular/core';
import {
  NextObserver,
  Observable,
  ObservableInput,
  Observer,
  Unsubscribable
} from 'rxjs';
import { createRenderAware, getStrategies, RenderAware } from '../core';
import { RxViewContext } from '../core/render-aware/render-aware.interface';

/**
 * @publicApi
 */
export class RxIfContext<T = unknown> extends RxViewContext<T> {
  public rxIf: T = undefined;
}

/**
 * A structural directive that conditionally includes a template based on the value of
 * an expression coerced to Boolean.
 * When the expression evaluates to true, Angular renders the template
 * provided in a `then` clause, and when  false or null,
 * Angular renders the template provided in an optional `else` clause. The default
 * template for the `else` clause is blank.
 *
 * A [shorthand form](guide/structural-directives#the-asterisk--prefix) of the directive,
 * `*ngIf="condition"`, is generally used, provided
 * as an attribute of the anchor element for the inserted template.
 * Angular expands this into a more explicit version, in which the anchor element
 * is contained in an `<ng-template>` element.
 *
 * Simple form with shorthand syntax:
 *
 * ```
 * <div *ngIf="condition">Content to render when condition is true.</div>
 * ```
 *
 * Simple form with expanded syntax:
 *
 * ```
 * <ng-template [ngIf]="condition"><div>Content to render when condition is
 * true.</div></ng-template>
 * ```
 *
 * Form with an "else" block:
 *
 * ```
 * <div *ngIf="condition; else elseBlock">Content to render when condition is true.</div>
 * <ng-template #elseBlock>Content to render when condition is false.</ng-template>
 * ```
 *
 * Shorthand form with "then" and "else" blocks:
 *
 * ```
 * <div *ngIf="condition; then thenBlock else elseBlock"></div>
 * <ng-template #thenBlock>Content to render when condition is true.</ng-template>
 * <ng-template #elseBlock>Content to render when condition is false.</ng-template>
 * ```
 *
 * Form with storing the value locally:
 *
 * ```
 * <div *ngIf="condition as value; else elseBlock">{{value}}</div>
 * <ng-template #elseBlock>Content to render when value is null.</ng-template>
 * ```
 *
 * @usageNotes
 *
 * The `*ngIf` directive is most commonly used to conditionally show an inline template,
 * as seen in the following  example.
 * The default `else` template is blank.
 *
 * {@example common/ngIf/ts/module.ts region='RxIfSimple'}
 *
 * ### Showing an alternative template using `else`
 *
 * To display a template when `expression` evaluates to false, use an `else` template
 * binding as shown in the following example.
 * The `else` binding points to an `<ng-template>`  element labeled `#elseBlock`.
 * The template can be defined anywhere in the component view, but is typically placed right after
 * `ngIf` for readability.
 *
 * {@example common/ngIf/ts/module.ts region='RxIfElse'}
 *
 * ### Using an external `then` template
 *
 * In the previous example, the then-clause template is specified inline, as the content of the
 * tag that contains the `ngIf` directive. You can also specify a template that is defined
 * externally, by referencing a labeled `<ng-template>` element. When you do this, you can
 * change which template to use at runtime, as shown in the following example.
 *
 * {@example common/ngIf/ts/module.ts region='RxIfThenElse'}
 *
 * ### Storing a conditional result in a variable
 *
 * You might want to show a set of properties from the same object. If you are waiting
 * for asynchronous data, the object can be undefined.
 * In this case, you can use `ngIf` and store the result of the condition in a local
 * variable as shown in the the following example.
 *
 * {@example common/ngIf/ts/module.ts region='RxIfAs'}
 *
 * This code uses only one `AsyncPipe`, so only one subscription is created.
 * The conditional statement stores the result of `userStream|async` in the local variable `user`.
 * You can then bind the local `user` repeatedly.
 *
 * The conditional displays the data only if `userStream` returns a value,
 * so you don't need to use the
 * [safe-navigation-operator](guide/template-syntax#safe-navigation-operator) (`?.`)
 * to guard against null values when accessing properties.
 * You can display an alternative template while waiting for the data.
 *
 * ### Shorthand syntax
 *
 * The shorthand syntax `*ngIf` expands into two separate template specifications
 * for the "then" and "else" clauses. For example, consider the following shorthand statement,
 * that is meant to show a loading page while waiting for data to be loaded.
 *
 * ```
 * <div class="hero-list" *ngIf="heroes else loading">
 *  ...
 * </div>
 *
 * <ng-template #loading>
 *  <div>Loading...</div>
 * </ng-template>
 * ```
 *
 * You can see that the "else" clause references the `<ng-template>`
 * with the `#loading` label, and the template for the "then" clause
 * is provided as the content of the anchor element.
 *
 * However, when Angular expands the shorthand syntax, it creates
 * another `<ng-template>` tag, with `ngIf` and `ngIfElse` directives.
 * The anchor element containing the template for the "then" clause becomes
 * the content of this unlabeled `<ng-template>` tag.
 *
 * ```
 * <ng-template [ngIf]="heroes" [ngIfElse]="loading">
 *  <div class="hero-list">
 *   ...
 *  </div>
 * </ng-template>
 *
 * <ng-template #loading>
 *  <div>Loading...</div>
 * </ng-template>
 * ```
 *
 * The presence of the implicit template object has implications for the nesting of
 * structural directives. For more on this subject, see
 * [Structural Directives](https://angular.io/guide/structural-directives#one-per-element).
 *
 * @ngModule CommonModule
 * @publicApi
 */
@Directive({ selector: '[rxIf]' })
export class RxIf<T = unknown> implements OnDestroy {
  constructor(
    private _viewContainer: ViewContainerRef,
    templateRef: TemplateRef<RxIfContext<T>>,
    cdRef: ChangeDetectorRef
  ) {
    this._thenTemplateRef = templateRef;
    this.renderAware = createRenderAware<T>({
      strategies: getStrategies<T>({ cdRef }),
      resetObserver: this.resetObserver,
      updateObserver: this.updateObserver
    });
    this.subscription = this.renderAware.subscribe();
  }

  @Input()
  set strategy(config: string | Observable<string> | undefined) {
    if (config) {
      this.renderAware.nextStrategy(config);
    }
  }

  /**
   * The Boolean expression to evaluate as the condition for showing a template.
   */
  @Input()
  set ngIf(condition: T) {
    this._context.$implicit = this._context.rxIf = condition;
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to true.
   */
  @Input()
  set ngIfThen(templateRef: TemplateRef<RxIfContext<T>> | null) {
    assertTemplate('ngIfThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null; // clear previous view if any.
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to false.
   */
  @Input()
  set ngIfElse(templateRef: TemplateRef<RxIfContext<T>> | null) {
    assertTemplate('ngIfElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null; // clear previous view if any.
    this._updateView();
  }

  /** @internal */
  public static ngIfUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `ngIf` input within the template.
   *
   * The presence of this static field is a signal to the Ivy template type check compiler that
   * when the `RxIf` structural directive renders its template, the type of the expression bound
   * to `ngIf` should be narrowed in some way. For `RxIf`, the binding expression itself is used to
   * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `RxIf`.
   */
  static ngTemplateGuard_rxIf: 'binding';
  protected readonly subscription: Unsubscribable;
  private readonly renderAware: RenderAware<T | null | undefined>;

  private embeddedView: any;
  private readonly viewContext: RxIfContext<T | undefined | null> = {
    $implicit: undefined,
    rxIf: undefined,
    $error: false,
    $complete: false
  };

  resetObserver: NextObserver<void> = {
    next: () => {
      // if not initialized no need to set undefined
      if (this.embeddedView) {
        this.viewContext.$implicit = undefined;
        this.viewContext.rxIf = undefined;
        this.viewContext.$error = false;
        this.viewContext.$complete = false;
      }
    }
  };
  updateObserver: Observer<T | null | undefined> = {
    next: (value: T | null | undefined) => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.viewContext.$implicit = value;
      this.viewContext.rxIf = value;
    },
    error: (error: Error) => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.viewContext.$error = true;
    },
    complete: () => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.viewContext.$complete = true;
    }
  };
  private _context: RxIfContext<T> = new RxIfContext<T>();
  private _thenTemplateRef: TemplateRef<RxIfContext<T>> | null = null;
  private _elseTemplateRef: TemplateRef<RxIfContext<T>> | null = null;
  private _thenViewRef: EmbeddedViewRef<RxIfContext<T>> | null = null;
  private _elseViewRef: EmbeddedViewRef<RxIfContext<T>> | null = null;

  /**
   * Asserts the correct type of the context for the template that `RxIf` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `RxIf` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T>(
    dir: RxIf<T>,
    ctx: any
  ): ctx is RxIfContext<NonNullable<T>> {
    return true;
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef = this._viewContainer.createEmbeddedView(
            this._thenTemplateRef,
            this._context
          );
        }
      }
    } else {
      if (!this._elseViewRef) {
        this._viewContainer.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef = this._viewContainer.createEmbeddedView(
            this._elseTemplateRef,
            this._context
          );
        }
      }
    }
  }

  createEmbeddedView() {
    this.embeddedView = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this.ViewContext
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.viewContainerRef.clear();
  }
}

function assertTemplate(
  property: string,
  templateRef: TemplateRef<any> | null
): void {
  const isTemplateRefOrNull = !!(
    !templateRef || templateRef.createEmbeddedView
  );
  if (!isTemplateRefOrNull) {
    throw new Error(
      `${property} must be a TemplateRef, but received '${stringify(
        templateRef
      )}'.`
    );
  }
}

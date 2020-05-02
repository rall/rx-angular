import { NextObserver, Observer } from 'rxjs';

export class RxViewContext<T = unknown> {
  // to enable `let` syntax we have to use $implicit (var; let v = var)
  $implicit?: T;
  // set context var complete to true (var$; let e = $error)
  $error? = false;
  // set context var complete to true (var$; let c = $complete)
  $complete? = false;
}

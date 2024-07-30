import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
} from '@angular/router';

export class CustomReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ) {
    return (
      super.shouldReuseRoute(future, curr) &&
      future.data['shouldReuseRoute'] !== false
    );
  }
}

import { NgModule } from '@angular/core';
import { RxIf } from './if.directive';

const EXPORTED_DECLARATIONS = [RxIf];

@NgModule({
  declarations: EXPORTED_DECLARATIONS,
  exports: [EXPORTED_DECLARATIONS]
})
export class IfModule {}

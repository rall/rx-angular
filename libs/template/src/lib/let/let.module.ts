import { NgModule } from '@angular/core';
import { RxLet } from './let.directive';

const EXPORTED_DECLARATIONS = [RxLet];

@NgModule({
  declarations: EXPORTED_DECLARATIONS,
  exports: [EXPORTED_DECLARATIONS]
})
export class LetModule {}

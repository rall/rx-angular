import { NgModule } from '@angular/core';

import { LetModule } from './let';
import { PushModule } from './push';
import { IfModule } from './if';

@NgModule({
  exports: [LetModule, PushModule, IfModule]
})
export class TemplateModule {}

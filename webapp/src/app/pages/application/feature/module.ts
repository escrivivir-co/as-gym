import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlephKadsRoutingModule } from './routing.module';

import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    SafePipe,
  ],
  imports: [
    CommonModule,
    AlephKadsRoutingModule
  ],
  exports: [
  ],
})
export class AlephKadsModule { }

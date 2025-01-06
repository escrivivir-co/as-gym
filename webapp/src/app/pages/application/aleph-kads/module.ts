import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlephKadsRoutingModule } from './routing.module';
import { AlephKadsComponent } from './component';

import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AlephKadsComponent,
    SafePipe,
  ],
  imports: [
    CommonModule,
    AlephKadsRoutingModule
  ],
  exports: [
    AlephKadsComponent,
  ],
})
export class AlephKadsModule { }

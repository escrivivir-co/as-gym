import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './routing.module';

import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    SafePipe,
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  exports: [
  ],
})
export class FeatureModule { }

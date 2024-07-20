import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlephKadsComponent } from './dynamic-form.component';

const routes: Routes = [
  {
    path: '',
    component: AlephKadsComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlephKadsRoutingModule { }

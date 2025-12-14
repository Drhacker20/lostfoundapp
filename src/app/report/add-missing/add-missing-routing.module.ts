import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMissingPage } from './add-missing.page';

const routes: Routes = [
  {
    path: '',
    component: AddMissingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMissingPageRoutingModule {}

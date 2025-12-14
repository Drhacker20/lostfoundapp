import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostItemDetailsPage } from './lost-item-details.page';

const routes: Routes = [
  {
    path: '',
    component: LostItemDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LostItemDetailsPageRoutingModule {}

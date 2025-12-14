import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllItemsPage } from './all-items.page';

const routes: Routes = [
  {
    path: '',
    component: AllItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllItemsPageRoutingModule {}

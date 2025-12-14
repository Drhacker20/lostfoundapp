import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportMissingPage } from './report-missing.page';

const routes: Routes = [
  {
    path: '',
    component: ReportMissingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportMissingPageRoutingModule {}

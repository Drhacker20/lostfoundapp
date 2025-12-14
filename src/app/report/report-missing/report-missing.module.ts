import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ReportMissingPageRoutingModule } from './report-missing-routing.module';
import { ReportMissingPage } from './report-missing.page';

// ✅ Import AddMissing module instead of popover
import { AddMissingPageModule } from '../add-missing/add-missing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportMissingPageRoutingModule,
   
  ],
  declarations: [
    ReportMissingPage // ✅ Only the main page is declared
  ]
})
export class ReportMissingPageModule {}

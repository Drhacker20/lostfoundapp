import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMissingPageRoutingModule } from './add-missing-routing.module';

import { AddMissingPage } from './add-missing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMissingPageRoutingModule
  ],
  declarations: [AddMissingPage]
})
export class AddMissingPageModule {}

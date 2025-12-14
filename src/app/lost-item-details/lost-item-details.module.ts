import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostItemDetailsPageRoutingModule } from './lost-item-details-routing.module';

import { LostItemDetailsPage } from './lost-item-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostItemDetailsPageRoutingModule
  ],
  declarations: [LostItemDetailsPage]
})
export class LostItemDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';

import { DetailsPage } from './details.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { QRCodeComponent } from "angularx-qrcode"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    LazyLoadImageModule, QRCodeComponent
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from "ng-lazyload-image"

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksPageRoutingModule,
    LazyLoadImageModule
  ],
  declarations: [TasksPage]
})
export class TasksPageModule { }

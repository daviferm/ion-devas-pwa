import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarriosPageRoutingModule } from './barrios-routing.module';

import { BarriosPage } from './barrios.page';
import { PipesModule } from '../../../pipes/pipes.module';
import { ModalInfoComponent } from 'src/app/components/modal-info/modal-info.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MapItemsComponent } from 'src/app/components/map-items/map-items.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarriosPageRoutingModule,
    PipesModule,
    ModalInfoComponent,
    HeaderComponent,
    MapItemsComponent
  ],
  declarations: [BarriosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarriosPageModule {}

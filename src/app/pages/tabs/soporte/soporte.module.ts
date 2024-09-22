import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoportePageRoutingModule } from './soporte-routing.module';

import { SoportePage } from './soporte.page';
import { MapaComponent } from 'src/app/components/mapa/mapa.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoportePageRoutingModule,
    MapaComponent,
    NavbarComponent
  ],
  declarations: [SoportePage]
})
export class SoportePageModule {}

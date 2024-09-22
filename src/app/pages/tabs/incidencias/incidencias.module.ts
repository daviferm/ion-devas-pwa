import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidenciasPageRoutingModule } from './incidencias-routing.module';

import { IncidenciasPage } from './incidencias.page';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MapItemsComponent } from 'src/app/components/map-items/map-items.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidenciasPageRoutingModule,
    NavbarComponent,
    MapItemsComponent
  ],
  declarations: [IncidenciasPage]
})
export class IncidenciasPageModule {}

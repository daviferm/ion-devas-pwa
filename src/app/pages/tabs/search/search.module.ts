import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MapaComponent } from 'src/app/components/mapa/mapa.component';
import { MapItemsComponent } from 'src/app/components/map-items/map-items.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    NavbarComponent,
    MapaComponent,
    MapItemsComponent
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}

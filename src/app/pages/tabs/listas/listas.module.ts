import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ListasPageRoutingModule } from './listas-routing.module';

import { ListasPage } from './listas.page';
import { UploadImgComponent } from 'src/app/components/upload-img/upload-img.component';
import { MapItemsComponent } from 'src/app/components/map-items/map-items.component';
import { ModalInfoComponent } from 'src/app/components/modal-info/modal-info.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MapaComponent } from 'src/app/components/mapa/mapa.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ListasPageRoutingModule,
    UploadImgComponent,
    MapItemsComponent,
    ModalInfoComponent,
    NavbarComponent,
    MapaComponent
  ],
  declarations: [ListasPage]
})
export class ListasPageModule {}

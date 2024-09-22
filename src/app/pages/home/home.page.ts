import { Component, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NavbarService } from '../../components/navbar/navbar.service';
import { GestionRutasService } from '../../services/gestion-rutas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public loadingController = inject( LoadingController );
  private navbarService = inject( NavbarService );
  private gestionRutasService = inject( GestionRutasService );

  mapSearch!: boolean;
  paginaActiva: string = 'search';

  public pageSelected: string = 'home';


  constructor() {
    this.pageSelected = 'home';
  }
  ngOnInit() {
  }

  // ionViewWillEnter() {
  //   console.log('ionViewWillEnter');
  // }

  // ionViewDidEnter() {
  //   console.log('ionViewDidEnter');
  // }

  // ====================================================
  // Gestionar las rutas para mostrar u ocultar el navbar
  // ====================================================
  ionTabsDidChange( page: any ) {
    // Enviar la ruta al servicio
    this.gestionRutasService.pageActive = page.tab;

    switch (page.tab) {
      case 'search':

        this.controlNavbar( this.gestionRutasService.searchPage );

        break;
      case 'listas':

        this.controlNavbar( this.gestionRutasService.listasPage );

        break;
      case 'incidencias':

        this.controlNavbar( this.gestionRutasService.incidenciasPage );

        break;
      case 'barrios':

        // this.controlNavbar( this.gestionRutasService.barriosPage );

        break;
      case 'soporte':

        this.controlNavbar( this.gestionRutasService.soportePage );
        this.gestionRutasService.getLocation.emit( true );

        break;
    }
  }


  controlNavbar( serviceRuta: boolean ) {

    if ( serviceRuta ) {
      this.navbarService.navbarOutIn.emit( false );
    } else {
      this.navbarService.navbarOutIn.emit( true );
    }

  }


}

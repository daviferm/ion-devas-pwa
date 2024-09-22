import { Component, inject, OnInit } from '@angular/core';
import { LayerBarrio, Parquimetro } from 'src/app/interfaces/markers.interface';
import { DataFormService } from '../../../services/data-form.service';
import { NavbarService } from '../../../components/navbar/navbar.service';
import { GestionRutasService } from '../../../services/gestion-rutas.service';
import { MapPolygonService } from 'src/app/services/map-polygon.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  private dataFormService = inject( DataFormService );
  private agmPolygonService = inject( MapPolygonService );
  private navbarService = inject( NavbarService );
  private gestioRutasService = inject( GestionRutasService );


  markers: Parquimetro[] = [];
  itemsBarrio!: Parquimetro[] | undefined;
  tareas: boolean = true;
  zoom: number = 12;
  marcadores: Parquimetro[] = [];
  marcador!: Parquimetro;
  lat: number =  40.459031;
  lng: number = -3.689918;
  selectedBarrio!: LayerBarrio;
  mapSearch!: boolean;
  aliasToast!: HTMLIonToastElement;
  mostrarMarker: boolean = false;
  centroMap = {lat: 40.459706, lng: -3.6899817};

  public pageSelected: string = 'home';

  constructor() {}

  ngOnInit() {

    this.dataFormService.enviarPageHome.subscribe( (mark: Parquimetro) => {
      this.zoom = 12;
      // this.marcadores = [ mark ];
      this.marcador = mark;
      this.marcador.latitud = Number(this.marcador.latitud);
      this.marcador.longitud = Number(this.marcador.longitud);
      this.centroMap = {lat: Number(mark.latitud), lng: Number(mark.longitud)};
      // this.selectedBarrio = [];
      this.selectedBarrio = this.agmPolygonService.getBarrio( mark.barrio.slice(0,3) )!;
      // this.selectedBarrio.push( barrio );
      this.mostrarMarker = true;
      this.navbarService.mostrarOcultarNavbar.emit( false );
      this.gestioRutasService.searchPage = true;
      this.dataFormService.buscarPaquimetro.emit( true );
      setTimeout( () => {
        this.zoom = 14;
      }, 100 );
    } )
  }

  // cerrarMapa( event: any ) {
  //   if ( event ) {
  //     this.mapSearch = false;
  //     this.gestioRutasService.searchPage = false;
  //     this.marcadores = [];
  //     this.lat =  40.459031;
  //     this.lng = -3.689918;
  //     this.zoom = 13;
  //     setTimeout( () => {
  //       this.zoom = 12;
  //     }, 100 )
  //     this.navbarService.mostrarOcultarNavbar.emit( true );
  //     this.itemsBarrio = undefined;
  //   }
  // }
  cerrarMapaItems( event: any ) {
    if ( event ) {
      this.zoom = 11;
      setTimeout( () => {
        this.zoom = 12;
      }, 100 )
      this.navbarService.mostrarOcultarNavbar.emit( true );

      this.itemsBarrio = undefined;
    }
  }

  mostrarBarrio( barrio: string ) {

    const centro = this.optenerCentro( barrio );

    setTimeout( () => {
      this.zoom = 12;
    }, 50 )
    setTimeout( () => {
      this.zoom = 15;
      this.lat = centro.lat;
      this.lng = centro.lng;
      }, 70 )

    this.itemsBarrio = this.dataFormService.obtenerBarrrio( String(barrio) );

    this.navbarService.mostrarOcultarNavbar.emit( false );

  }

  visionMapaGeneral() {
    this.mostrarMarker = false;
    this.gestioRutasService.searchPage = false;
    setTimeout( () => {
    }, 100 );
    setTimeout( () => {
      this.zoom = 12;
      this.centroMap = {lat: 40.459706, lng: -3.6899817};
    }, 120 );
  }

 // Optener cetro del mapa según el barrio
 optenerCentro(barrio: string) {
  const numBarrio = Number(barrio);
  let centro;
  switch (numBarrio) {
      case 44:
          centro = { lat: 40.436347, lng: -3.667389 };
          break;
      case 45:
          centro = { lat: 40.432375, lng: -3.676183 };
          break;
      case 46:
          centro = { lat: 40.433368, lng: -3.683588 };
          break;
      case 51:
          centro = { lat: 40.445408, lng: -3.684342 };
          break;
      case 52:
          centro = { lat: 40.443262, lng: -3.669103 };
          break;
      case 53:
          centro = { lat: 40.448204, lng: -3.67265 };
          break;
      case 54:
          centro = { lat: 40.455497, lng: -3.677462 };
          break;
      case 55:
          centro = { lat: 40.461893, lng: -3.679066 };
          break;
      case 56:
          centro = { lat: 40.472714, lng: -3.677789 };
          break;
      case 61:
          centro = { lat: 40.451753, lng: -3.707646 };
          break;
      case 62:
          centro = { lat: 40.452326, lng: -3.696489 };
          break;
      case 63:
          centro = { lat: 40.459081, lng: -3.693029 };
          break;
      case 64:
          centro = { lat: 40.469211, lng: -3.69408 };
          break;
      case 65:
          centro = { lat: 40.466564, lng: -3.702468 };
          break;
      case 66:
          centro = { lat: 40.459403, lng: -3.704318 };
          break;
      case 75:
          centro = { lat: 40.441979, lng: -3.698296 };
          break;
      case 76:
          centro = { lat: 40.441833, lng: -3.71095 };
          break;
      case 84:
          centro = { lat: 40.476389, lng: -3.708886 };
          break;
      case 85:
          centro = { lat: 40.48158, lng: -3.697391 };
          break;
      case 93:
          centro = { lat: 40.449879, lng: -3.714955 };
          break;
      case 94:
        centro = { lat: 40.461083, lng: -3.710878 };
        break;
      case 151:
        centro = { lat: 40.428222, lng: -3.654680 };
        break;
      case 152:
        centro = { lat: 40.432591, lng: -3.644426 };
        break;
      case 153:
        centro = { lat: 40.434504, lng: -3.649170 };
        break;
      case 154:
        centro = { lat: 40.435913, lng: -3.654189 };
        break;
      case 155:
        centro = { lat: 40.442607, lng: -3.653534 };
        break;
      case 156:
        centro = { lat: 40.450914, lng: -3.656763 };
        break;
      case 157:
        centro = { lat: 40.456294, lng: -3.660946 };
        break;
      case 158:
        centro = { lat: 40.464079, lng: -3.666230 };
        break;
      default:
        centro = { lat: 40.459081, lng: -3.693029 };
        break;
  }
  return centro;
}


}

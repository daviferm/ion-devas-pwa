import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Subscription, Subject } from 'rxjs';
import { BarrioInterface, IncidenciaInteface, LayerBarrio, ListaInteface, Parquimetro } from 'src/app/interfaces/markers.interface';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { GestionRutasService } from 'src/app/services/gestion-rutas.service';
import { MapPolygonService } from 'src/app/services/map-polygon.service';
import { NativeGeolocationService } from 'src/app/services/native-geolocation.service';
import { DetallesModalComponent } from '../detalles-modal/detalles-modal.component';

@Component({
  selector: 'app-map-items',
  templateUrl: './map-items.component.html',
  styleUrls: ['./map-items.component.scss'],
  standalone: true,
  imports: [ IonicModule, GoogleMapsModule, DetallesModalComponent, PipesModule ]
})
export class MapItemsComponent implements OnInit {

  private polygonService = inject( MapPolygonService );
  public gestionRutasService = inject( GestionRutasService );
  private nativeLocationService = inject( NativeGeolocationService );

  @Input() center: google.maps.LatLngLiteral = { lat: 40.458930, lng: -3.685516 };

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    scaleControl: true,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    mapTypeControl: false,
    rotateControl: true,
    streetViewControl: false,
    panControl: true,
  }
  polygonOptions: google.maps.PolygonOptions = {
    fillColor: '#5cc9f5',
    fillOpacity: .4,
    strokeColor: 'black',
    strokeWeight: 0.5,
    geodesic: true
  }
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    opacity: 1
    // animation: google.maps.Animation.DROP
  };

  markerGpsOptions: google.maps.MarkerOptions = {
    draggable: false,
    zIndex: 10000
    // optimized: true,
    // icon: this.imgPosition
  };

  @Output() closeMap: EventEmitter<boolean> = new EventEmitter();
  @Output() itemEliminado: EventEmitter<ListaInteface> = new EventEmitter();
  @Input() listaActiva!: ListaInteface;
  @Input() tareaActiva!: BarrioInterface;
  @Input() zoomMap!: number;
  @Input() marcadores: Parquimetro[] = [];
  @Input() centroMap!: {lat: number, lng: number};
  // @Input() marcador: Parquimetro[];
  @Input() barriosSelec!: LayerBarrio[];
  pinMaker: string = 'assets/img/pin-marker-alias.png';
  imgMarcadores = 'assets/img/icono-position.png';
  pinItems: string = 'assets/img/pin-items.png'
  openModal: boolean = false;
  infoMarker!: Parquimetro;
  tareaTitle!: string;
  latGps!: number;
  lngGps!: number;
  imgPosition = 'assets/img/marker-car.png';
  $subscription!: Subscription;
  $obsLocation!: Subject<unknown>;
  $obsGps!: Subscription;
  gps: boolean = false;
  @Input() incidenciasList!: IncidenciaInteface[];

  constructor() {
    this.barriosSelec = this.polygonService.barriosLayers;
  }

  ngOnInit() {
    this.$obsLocation = new Subject();
    this.$subscription = this.nativeLocationService.watchPosition().subscribe( this.$obsLocation );
    this.$obsGps = this.$obsLocation.subscribe( ( data: any ) => {
        this.latGps = data.coords.latitude;
        this.lngGps = data.coords.longitude;
        this.gps = true;
    } )
  }
  abrirModalIncidencia( incidencia: IncidenciaInteface ) {
    this.infoMarker = incidencia.item;
    this.tareaTitle = incidencia.titulo;
    this.openModal = true;
  }

  abrirModal( marker: Parquimetro ) {
    this.infoMarker = marker;
    const ruta = this.gestionRutasService.pageActive;
    switch (ruta) {
      case 'barrios':
        this.tareaTitle = this.tareaActiva.titulo;
        break;
      case 'listas':
        this.tareaTitle = this.listaActiva.titulo;
        break;

      default:
        this.tareaTitle = 'Sin título'

    }
    this.openModal = true;
  }
  cerrarMapa() {

    this.closeMap.emit( true );
    // this.navbarService.mostrarOcultarNavbar.emit( true );
    this.gps = false;
    this.$subscription.unsubscribe();
  }

  cerrarModalInfo( event: boolean ) {
    this.openModal = false;
  }
  // =================================================
  // Realiza una tarea en función de la ruta
  // =================================================
  tareaRealizada( marker: Parquimetro ) {
    const ruta = this.gestionRutasService.pageActive;
    switch (ruta) {
      case 'barrios':
        if ( !marker.hecho ) {
          this.infoMarker.hecho = true;
          this.infoMarker.opacidad = 0.5;
        } else {
          this.infoMarker.hecho = false;
          this.infoMarker.opacidad = 1;
        }
        this.openModal = false;
        break;
      case 'listas':
        const idx = this.marcadores.findIndex( item => item.alias === marker.alias );
        this.marcadores.splice(idx, 1);
        this.openModal = false;
        // Enviar tarea actualizada a página Listas
        this.itemEliminado.emit( this.listaActiva );
        break;
      case 'incidencias':
        const index = this.incidenciasList.findIndex( item => item.localId === marker.id );
        this.incidenciasList.splice( index, 1 );
        if ( this.incidenciasList.length == 0 ) this.cerrarMapa();
        localStorage.setItem('lista-incidencias', JSON.stringify(this.incidenciasList));
        this.openModal = false;
        break;
    }
  }

  mapaClick() {
  }

  zoomChangeMap( mapa: GoogleMap ) {
    if ( mapa.getZoom() === 17 ) {
      this.tareaActiva.items!.forEach( item => item.idx = item.alias );
    }
    if ( mapa.getZoom() === 16 ) {
      this.tareaActiva.items!.forEach( item => item.idx = '' );
    }
  }

  obtenerPosicion() {
    this.nativeLocationService.getGeolocation().then( (data: any) => {
      this.gps = true;
      this.latGps = Number(data.coords.latitude);
      this.lngGps = Number(data.coords.longitude);
    } )
  }

  centrarPosicionGps( mapa: GoogleMap ) {
    mapa.panTo( {lat: this.latGps, lng: this.lngGps} );
  }
}

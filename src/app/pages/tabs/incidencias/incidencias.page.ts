import { Component, inject, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { IncidenciaInteface } from 'src/app/interfaces/markers.interface';
import { DataFormService } from 'src/app/services/data-form.service';
import { GestionRutasService } from 'src/app/services/gestion-rutas.service';
import { Parquimetro } from '../../../interfaces/markers.interface';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.page.html',
  styleUrls: ['./incidencias.page.scss'],
})
export class IncidenciasPage implements OnInit {

  private navbarService = inject( NavbarService );
  public alertController = inject( AlertController );
  public toastController = inject( ToastController );
  private dataService = inject( DataFormService );
  public modalController = inject( ModalController );
  private gestionRutasService = inject( GestionRutasService );

  listIncidencias: IncidenciaInteface[] = [];
  reorderDisable: boolean = true;
  tareas: boolean = false;
  mapSearch: boolean = false;
  centerLat!: number;
  centerLng!: number;
  zoomMap: number = 12;

  constructor() {

    this.actualizarIncidenciasStorge();
  }

  ngOnInit() {
    this.dataService.enviarPageIncidencias.subscribe( resp  => {
      if ( resp ) {
        this.presentAlertIncidencia( resp );
      }
    })
  }

  // =================================================
  // Mostrar mapa con todos los parquímetros de la lista
  // =================================================
  mostrarMapa(): void {
    if ( this.listIncidencias.length > 0 ) {
    this.navbarService.mostrarOcultarNavbar.emit( false );
    this.mapSearch = true;
    this.gestionRutasService.incidenciasPage = true;
    this.centerLat = Number(this.listIncidencias[0].item.latitud);
    this.centerLng = Number(this.listIncidencias[0].item.longitud);
    this.zoomMap = 12;
      setTimeout( () => {
        this.zoomMap = 13.5;
      }, 200)
  }
  }
  // =================================================
  // Cerrar mapa
  // =================================================
  cerrandoMapa( event: boolean ) {
    if ( event ) {
      this.navbarService.mostrarOcultarNavbar.emit( true );
      this.mapSearch = false;
      this.gestionRutasService.incidenciasPage = false;
    }
  }
  // =================================================
  // Alert para introducir el título de la tarea
  // =================================================
  async presentAlertIncidencia( element: Parquimetro ) {
    const alert = await this.alertController.create({
      header: 'Nueva tarea',
      message: 'Introduce un nombre para la tarea.',
      translucent: true,
      inputs: [
      {
        name: 'titulo',
        type: 'text',
        min: 3,
        max: 15,
        attributes: {
          autoComplete: 'off',
          autoFocus: true
        },
        placeholder: 'Escribe un título',
        handler: () => {
         console.log('Input tarea...');
        }
      },
      ],
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
         console.log('Cancelar...');
        }
      }, {
        text: 'Ok',
        handler: (input) => {

          if ( input.titulo.length > 1 ) {

            const incidencia: IncidenciaInteface = {
              localId: new Date().getTime(),
              titulo: input.titulo,
              item: element
            }
            this.guardarIncidencia( input.titulo, element );

          } else {
            this.presentToastWithOptions('El título debe tener mas de 1 caracter.');
          }


        }
      }
      ]
    });
    await alert.present();
  }
  // =================================================
  // Mensaje Toast en la parte superior
  // =================================================
  async presentToastWithOptions(mensage: string) {
    const toast = await this.toastController.create({
      message: mensage,
      position: 'bottom',
      duration: 2000,
      cssClass: 'mytoast',
      buttons: [
        {
          side: 'start',
          icon: 'map-outline',
        }, {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  guardarIncidencia(titulo: string, element: Parquimetro) {
    element.latitud = Number(element.latitud);
    element.longitud = Number(element.longitud);
    const id = new Date().getTime();
    element.id = id;
    const newtarea: IncidenciaInteface = {
      localId: id,
      titulo: titulo,
      item: element
    }
    this.listIncidencias.push( newtarea );
    localStorage.setItem('lista-incidencias', JSON.stringify(this.listIncidencias));
  }

  actualizarIncidenciasStorge() {
    this.listIncidencias = [];
    const infoStorage = (JSON.parse(localStorage.getItem('lista-incidencias')!)) ? JSON.parse(localStorage.getItem('lista-incidencias')!) : [];
    for ( let elem of infoStorage ) {
      const tarea: IncidenciaInteface = {
        localId: elem.localId,
        titulo: elem.titulo,
        item: elem.item
      }
      tarea.item.latitud = Number( tarea.item.latitud );
      tarea.item.longitud = Number( tarea.item.longitud );
      tarea.item.latitud = Number( tarea.item.latitud );
      tarea.item.longitud = Number( tarea.item.longitud );

      this.listIncidencias.push( tarea );

    }
  }

  borrarIncidencia( idx: number ) {
    this.listIncidencias.splice( idx, 1 );
    console.log(this.listIncidencias);
    localStorage.setItem('lista-incidencias', JSON.stringify(this.listIncidencias));
  }
  doReorder(event: any) {
    this.listIncidencias = event.detail.complete( this.listIncidencias );
    localStorage.setItem('lista-incidencias', JSON.stringify(this.listIncidencias));
  }

}

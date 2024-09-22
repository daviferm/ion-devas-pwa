import { Component, inject, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { IonList, AlertController, ToastController, IonInput } from '@ionic/angular';
import { NavbarService } from '../../../components/navbar/navbar.service';
import { ListaInteface, Parquimetro } from '../../../interfaces/markers.interface';
import { DataFormService } from '../../../services/data-form.service';
import { Subscription } from 'rxjs';
// import { IonReorderGroup } from '@ionic/angular';
// import { ItemReorderEventDetail } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { GestionRutasService } from '../../../services/gestion-rutas.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage implements OnInit {

  alertButtons = ['Action'];

  private navbarService = inject( NavbarService );
  public alertController = inject( AlertController );
  public toastController = inject( ToastController );
  private dataService = inject( DataFormService );
  public modalController = inject( ModalController );
  private gestionRutasService = inject( GestionRutasService );
  private renderer = inject( Renderer2 );

  @ViewChild(IonList) lista!: IonList;
  @ViewChild(IonInput) inputAlert!: IonInput;

  tareasLista: ListaInteface[] | null = [];
  idxLista!: number;
  idxItem!: number;
  tareas: boolean = true;
  reorderDisable: boolean = false;
  // Variable para mostrar el mapa con los parquímetros de la lista
  mapSearch: boolean = false;
  //===============================================
  // Variable para mostrar listado tareas o items
  //===============================================
  listaTareas: boolean = true;
  tareaActiva!: ListaInteface | null;
  paginaActiva: string = 'listas';
  marcadores!: Parquimetro[];
  centroMap!: {lat: number, lng: number};
  zoomMap!: number;
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false,
    speed: 400
  };
  // openModal: boolean = false;
  modalUploadImg: boolean = false;
  registroObs!: Subscription;
  modalOpen: boolean = false;

  constructor() {
    this.actualizarLocalStorage();
    this.mapSearch = false;
    this.gestionRutasService.pageActive = 'listas';

    }

  ngOnInit() {
    this.registroObs = this.dataService.enviarPageTareas.subscribe( (resp) => {

      // Comprobar si el parquimetro está en la lista
      const existe = this.tareaActiva!.items.find( item => item.alias === resp.alias );
      if ( !existe ) {
        this.tareaActiva!.items.push( resp );
        localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
        console.log('parquítro guardado en storage...');
      } else {
        this.presentAlertExiste();
      }
    } )

  }

  ngOnDestroy() {
    this.registroObs.unsubscribe();
  }

  doReorder(event: any) {
    // Comprobar si estamos en lista de tareas
    if ( !this.tareaActiva ) {
    this.tareasLista = event.detail.complete(this.tareasLista);
    } else {
    // Comprobar si estamos dentro de una lista
    this.tareaActiva.items = event.detail.complete(this.tareaActiva.items);
    }
    localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
  }


  borrarItem(idx:number) {
    this.lista.closeSlidingItems()
    this.tareaActiva!.items.splice(idx,1);
    localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
  }

  borrarTarea( idx:number ) {
    this.lista.closeSlidingItems();
    this.tareasLista!.splice(idx,1);
    localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
  }
  itemEliminadoMapa( tarea: ListaInteface ) {
    const idx = this.tareasLista!.findIndex( t => t.localId === tarea.localId );
    this.tareasLista!.splice( idx, 1, tarea );

    localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
    this.actualizarLocalStorage();
    if ( tarea.items.length == 0 ) {
      this.cerrandoMapa( true );
    }
    this.presentToastWithOptionsTop('Tarea realizada.');
  }

  verInfo( item: Parquimetro, titulo: string ) {
    // console.log(item);
    console.log('Información del parquímetro..');
  }


  mostrarImagen(i: number) {
    this.idxItem = i;
    this.modalUploadImg = true;
  }
  mostrarModalUploadImg( i: number) {

    this.idxItem = i;
    this.modalUploadImg = true;
  }
  cerrarModalUploadImg( tarea: ListaInteface ) {

    if ( tarea ) {
      this.tareasLista!.splice( this.idxLista, 1, tarea );
      localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
    }
    this.modalUploadImg = false;
  }

  nextSlide(tarea: ListaInteface, i: number) {
    this.idxLista = i;
    this.tareaActiva = tarea;
    this.listaTareas = false;
    this.tareas = false;
  }

  prevSlide() {
    this.listaTareas = true;
    this.tareas = true;
    this.tareaActiva = null
    // Guardar cambios en el Storage
    localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
  }
  // Evento para saber cuando termita el evenots de volver al Slide prencipal
  ionSlidePrevEnd() {
    this.tareaActiva = null;
  }
  // =================================================
  // Mostrar mapa con todos los parquímetros de la lista
  // =================================================
  mostrarMapa(): void {
    if ( this.tareaActiva!.items.length > 0 ) {
        this.zoomMap = 12;
        this.tareaActiva!.items.forEach( item => {
        item.latitud = Number(item.latitud);
        item.longitud = Number(item.longitud);
      } )
      this.centroMap = { lat: Number(this.tareaActiva!.items[0].latitud), lng: Number(this.tareaActiva!.items[0].longitud) };
      // this.gestionRutasService.listasPage = true;
      this.navbarService.mostrarOcultarNavbar.emit( false );
      this.gestionRutasService.listasPage = true;
      this.mapSearch = true;
      setTimeout( () => {
        this.zoomMap = 15;
      }, 100 );
    }
  }
  // =================================================
  // Cerrar mapa
  // =================================================
  cerrandoMapa( event: boolean ) {
    if ( event ) {
      this.navbarService.mostrarOcultarNavbar.emit( true );
      this.mapSearch = false;
      this.gestionRutasService.listasPage = false;
    }
  }
  // =================================================
  // Alert para introducir el título de la tarea
  // =================================================
  async presentAlertTarea() {
    const alert = await this.alertController.create({
      header: 'Nueva tarea',
      message: 'Introduce un nombre para la tarea.',
      inputs: [
        {
          name: 'input1',
          type: 'text',
          min: 3,
          max: 15,
        attributes: {
          autoComplete: 'off',
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
          if ( input.input1.length > 1 ) {

            this.guardarNuevaTarea( input.input1 );

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
  // Mensaje Toast en la parte inferior
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
  // =================================================
  // Mensaje Toast en la parte superior
  // =================================================
  async presentToastWithOptionsTop(mensage: string) {
    const toast = await this.toastController.create({
      message: mensage,
      position: 'top',
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
  // =================================================
  // Alert por si el parquimetro está en la lista
  // =================================================
  async presentAlertExiste() {
    const alert = await this.alertController.create({
      header: 'ESTA EN LA LISTA',
      message: 'El parquímetro ya se encuentra en la lista.',
      buttons: [{text: 'Ok'}]
    })

    alert.present();

  }


  guardarNuevaTarea(titulo: string) {
    const newtarea: ListaInteface = {
      localId: new Date().getTime(),
      titulo: titulo,
      items: []
    }
    this.tareasLista!.push( newtarea );
    localStorage.setItem('lista-mant', JSON.stringify( this.tareasLista ));
  }
  openModalInfo() {
    this.modalOpen = true;
  }

  closeModalInfo(event: any) {
    this.modalOpen = false;
  }

  actualizarLocalStorage() {

      this.tareasLista = JSON.parse( localStorage.getItem('lista-mant')!);


    if ( !this.tareasLista ) {
      this.tareasLista = [];
    }
  }


}

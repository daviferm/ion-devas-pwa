import { Component, inject } from '@angular/core';
import { MapPolygonService } from './services/map-polygon.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private polygonService = inject( MapPolygonService );

  constructor() {}
}

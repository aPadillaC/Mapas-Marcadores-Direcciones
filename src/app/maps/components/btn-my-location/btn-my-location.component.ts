import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(
    private mapService: MapService,
    private placesService: PlacesService
  ) {}

  goToMyLocation() {

    // Verificamos si tenemos ubicación de Usuario
    if ( !this.placesService.isUserLocationReady) throw Error(`No hay ubicación de usuario`)

    // Verificamos si tenemos mapa renderizado
    if ( !this.mapService.isMapReady) throw Error(`No hay mapa disponible`)

    // Llamamos al metodo del servicio para redirigirnos a nuestra ubicacion pasandole por parametros la ubicación inicial del usuario
    this.mapService.flyTo( this.placesService.userLocation! )

  }
}

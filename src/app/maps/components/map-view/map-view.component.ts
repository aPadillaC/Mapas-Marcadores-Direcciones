import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlacesService } from '../../services';
import { Map } from 'mapbox-gl';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {


  // ViewChild permite acceder a elementos DOM nativos que tienen una variable de referencia de plantalla
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  constructor (
    private placesService: PlacesService
  ) {}



  // Usamos el ngAlterViewInit para renderizar el mapa siempre
  ngAfterViewInit(): void {

    // Validamos que si no tenemos Localizacion no se muestre nada
    if (!this.placesService.userLocation) {
      throw Error('No hay placesService.userLocation');
    }

    // Código para mostrar el mapa
    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });
  }


}

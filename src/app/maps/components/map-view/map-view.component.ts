import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlacesService, MapService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';


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
    private placesService: PlacesService,
    private mapService: MapService
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


    // Defino mi popup
    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);


    // Defino el marcador
    new Marker({ color: 'red' })
      .setLngLat( this.placesService.userLocation )
      .setPopup( popup )
      .addTo( map )


    this.mapService.setMap( map )
  }


}

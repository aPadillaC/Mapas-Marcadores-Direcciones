import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // Propiedad privada para el valor del mapa
  private map: Map | undefined;


  // Metido para validad si hay mapa o no
  get isMapReady(){
    return !!this.map;
  }


  // Establece el valor de la propiedad privada map
  setMap( map: Map ) {
    this.map = map;
  }


  // Metodo que me permite moverme por el mapa usando el tipo que nos ofrece MapBox LngLatLike
  flyTo( coords: LngLatLike){

    if( !this.isMapReady ) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }
}

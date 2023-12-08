import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // Propiedad privada para el valor del mapa
  private map: Map | undefined;


  // Creo la variable para mis markers
  private markers: Marker[] =  [];


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



  // Metodo para colocar marcadores para los resultados de la busqueda
  createMarkersFromPlaces( places: Feature[], userLocation: [number, number] ) {

    if (!this.map) throw Error('Mapa no inicializado');

    // Vaciamos el mapa de marcadores pero siguen existiendo en el arreglo
    this.markers.forEach( marker => marker.remove());

    // Variable que contiene la creacion de los nuevos marcadores
    const newMarkers = [];

    // Recorremos cada componente del arreglo de places
    for( const place of places){

      // Extraemos el valor de lng y lat de cada uno
      const [lng, lat] = place.center;

      // Creamos el popup de cada lugar
      const popup = new Popup()
        .setHTML(`
          <h6>${ place.text }</h6>
          <span>${place.place_name}</span>
        `);

      // Creamos el nuevo marcador
      const newMarker = new Marker()
        .setLngLat([lng,lat])
        .setPopup( popup)
        .addTo( this.map );


      // Añadimos cada marcador al arreglo de nuevos marcadores
      newMarkers.push( newMarker );
    }

    // Le asignamos a la propiedad de la clase "markers" en nuevo valor correspondiente a los nuevos marcadores
    this.markers = newMarkers;

    // Si no hay marcadores no se ejecuta el resto de codigo
    if( places.length === 0 ) return;


    // todo: Limites del mapa

    // Creo la constante para los limites
    const bounds = new LngLatBounds()

    // Como en newMarkers tengo todos los resultados, recorro el array y lo paso a "bounds" mediante el metodo extend enviandole como parametro el metodo getLngLat() que contiene la info de las coordenadas
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat()))

    // Para que mi ubiacion no desaparezca del foco de la pantalla la introduzco tambien en la variable bounds
    bounds.extend( userLocation );

    // Metiante la propiedad fitBpunds a la propiedad map lo que hacemos es que se encuadre todos los resultados de la busqueda en la pantalla junto a la de mi ubicacion. Con el padding lo unico que hacemos es que los marcadores mas exteriores no queden a ras de la imagen
    this.map.fitBounds(bounds, {
      padding: 100
    })

  }
}

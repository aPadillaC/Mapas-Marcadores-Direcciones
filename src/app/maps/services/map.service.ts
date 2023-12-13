import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions';
import { InfoNavigation } from '../interfaces/infoNavigation';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // Propiedad privada para el valor del mapa
  private map: Map | undefined;





  // Creo la variable para mis markers
  private markers: Marker[] =  [];





  // Metodo para validar si hay mapa o no
  get isMapReady(){
    return !!this.map;
  }





  // Defino las variables kms y dist
  private dist: number = 0;
  private time: number = 0;





  // Constructor con la inyecciones necesarias para el funcionamiento del servicio
  constructor( private directionsApi: DirectionsApiClient) { }






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
      padding: 200
    })

  }





  // -----------------------------
  // Métodos para la navegación
  // ------------------------------




  // Método para la navegación
  getRouteBetweenPoints( start: [number, number], end: [number, number]) {

    // Usamos el metodo .join(',') para unir lng y lat por una "," por la forma de que Mapbox usa esos valores
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe( resp =>this.drawPolyline( resp.routes[0]) );

  }






  // Método para obtener la dist y mtrs entre los dos puntos
  private drawPolyline( route: Route) {

    console.log({kms: route.distance / 1000, duration: route.duration / 60});


    this.dist = route.distance / 1000;
    this.time = route.duration / 60;

    this.infoNavigation();


    // todo: Para que toda la ruta sea el foco de la pantalla


    // Se verifica si hay mapa
    if (! this.map ) throw Error('Mapa no inicializado')


    // Creamos la const coords para guardar todos los puntos de la ruta
    const coords = route.geometry.coordinates;

    // Creamos los bounds
    const bounds = new LngLatBounds();

    coords.forEach( ([lng, lat]) => {

      bounds.extend( [lng, lat] )
    });

    this.map.fitBounds(bounds, {
      padding: 200
    })





    // Definir la Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }




    // Todo: limpiar ruta previa
    if ( this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }


    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    });
  }





  // Metodo para rescatar la info de kms y dist
  public infoNavigation():InfoNavigation | undefined {

    const info = {
      dist: this.dist,
      time: this.time
    }

    return info;
  }




  public deleteInfoNavigation() {


    this.dist = 0;
    this.time = 0;
  }




}

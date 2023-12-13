import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api/placesApiCLient';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number]

  // Variables para evitar tener la lógica en los componentes
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];  //Guardamos el listado de busquedas

  get isUserLocationReady(): boolean {
    // Doble negacion devolvemos un true
    return !!this.userLocation;
  }

  constructor(
      private placesApi: PlacesApiClient,
      private mapService: MapService
    ) {
    // En el constructor llamo al metodo para obtener nuestra ubicación
    this.getUserLocation();
  }


  public async getUserLocation(): Promise<[number, number]> {

    return new Promise( (resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ( {coords } ) => {
          this.userLocation = [coords.longitude, coords.latitude]
          resolve(this.userLocation);
        },
        ( err ) => {
          alert('No se pudo obtener la Geolocalizacion')
          console.log(err);
          reject();
        }
      )
    })
  }



  // Método para realizar las peticiones http del buscador
  getPlacesByQuery( query: string = '') {

    // todo: evaluar cuando el query es nulo
    if ( query.length === 0 ) {
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }

    // Evaluamos si existe ubicacion o no
    if ( !this.userLocation ) throw Error('No hay userLocation');

    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.userLocation?.join(',')
      }
    })
      .subscribe( resp => {

        this.isLoadingPlaces = false;
        this.places = resp.features;

        // Llamo al método del servicio mapService que realiza la creación de los marcadores
        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!)
      });
  }



  // --------------------------
  // Ocultar el menu
  // --------------------------


  // Borro el arreglo de lugares
  deletePlaces() {

    this.places = [];
  }


}

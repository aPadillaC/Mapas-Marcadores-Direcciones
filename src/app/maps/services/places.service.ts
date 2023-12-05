import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api/placesApiCLient';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [number, number] | undefined;

  // Variables para evitar tener la lógica en los componentes
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];  //Guardamos el listado de busquedas

  get isUserLocationReady(): boolean {
    // Doble negacion devolvemos un true
    return !!this.userLocation;
  }

  constructor( private placesApi: PlacesApiClient) {
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

    // Evaluamos si existe ubicacion o no
    if ( !this.userLocation ) throw Error('No hay userLocation');

    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.userLocation?.join(',')
      }
    })
      .subscribe( resp => {
        console.log(resp.features);

        this.isLoadingPlaces = false;
        this.places = resp.features;
      });
  }

}

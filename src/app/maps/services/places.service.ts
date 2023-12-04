import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature, PlacesResponse } from '../interfaces/places';

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

  constructor( private http: HttpClient) {
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

    this.isLoadingPlaces = true;

    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ query }.json?limit=5&proximity=-4.491296524450917%2C36.72478985674242&language=es&access_token=pk.eyJ1IjoicGFkaTg4IiwiYSI6ImNsa2t6a245dTBlcWozY2w5dWR6eHhxbjMifQ.BFx7JnomOQA8k-NGgoCzZA`)
      .subscribe( resp => {
        console.log(resp.features);

        this.isLoadingPlaces = false;
        this.places = resp.features;
      });
  }

}

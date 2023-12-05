import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {

  // Constantes que vienen en la peticion
  public baseUrl: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';


  // Esto me permite usar las peticiones http como hasta ahora
  constructor(handler: HttpHandler){
    super(handler)
  }

  // Estoy creando mi propio http personalizado, la parte de options es para poder pasarle la proximidad como parámetro
  public override get<T>( url: string, options: {
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
    };
  }) {

    url = this.baseUrl + url;

    return super.get<T>( url, {
      params: {
        limit: 5,
        language: 'es',
        access_token: environment.apiKey,
        ...options.params
      }
    } );
  }
}

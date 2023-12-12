import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient {

  // Constantes que vienen en la peticion
  public baseUrl: string = 'https://api.mapbox.com/directions/v5/mapbox/driving';


  // Esto me permite usar las peticiones http como hasta ahora
  constructor(handler: HttpHandler){
    super(handler)
  }

  // Estoy creando mi propio http personalizado
  public override get<T>( url: string) {

    url = this.baseUrl + url;

    return super.get<T>( url, {
      params: {
        alternatives: false,
        geometries: 'geojson',
        language: 'es',
        overview: 'simplified',
        steps: false,
        access_token: environment.apiKey
      }
    } );
  }
}

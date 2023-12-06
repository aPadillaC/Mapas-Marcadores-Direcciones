import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  // Creamos esta propiedad para usarla a la hora de marcarla con la clase active
  public selectedId: string = "";

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}


  // Obtenemos el valor de isLoadingPlaces del servicio y lo usanmos luego para mostrar el mensaje de loading
  get isLoadingPlaces():boolean {

    return this.placesService.isLoadingPlaces;
  }

  // Obtenemos los resultados de la busqueda
  get places():Feature[] {

    return this.placesService.places;
  }




  // Metodo para dirigirnos en el mapa a la ubicación seleccionada
  flyto( place: Feature) {

    // Capturamos el valor del id que hemos seleccionado y lo guardamos en la variable selectedId
    this.selectedId =place.id;


    // Destructuramos las variables lng y lat
    const [ lng, lat ] = place.center;

    // Nos redirigimos a las cordenadas de la dirección seleccionada
    this.mapService.flyTo([ lng, lat])
  }

}

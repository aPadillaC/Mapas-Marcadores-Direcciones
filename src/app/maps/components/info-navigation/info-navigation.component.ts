import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { InfoNavigation } from '../../interfaces/infoNavigation';

@Component({
  selector: 'app-info-navigation',
  templateUrl: './info-navigation.component.html',
  styleUrls: ['./info-navigation.component.css']
})
export class InfoNavigationComponent {

  constructor(
    private mapService: MapService,
    private placeService: PlacesService
  ){ }


  get infoNavigation(): InfoNavigation | undefined {

    if ( this.mapService.infoNavigation() === undefined) return;

    console.log(this.mapService.infoNavigation());



    return this.mapService.infoNavigation();
  }
}

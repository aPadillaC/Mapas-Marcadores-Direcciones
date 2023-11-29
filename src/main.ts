import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoicGFkaTg4IiwiYSI6ImNsa2t6a245dTBlcWozY2w5dWR6eHhxbjMifQ.BFx7JnomOQA8k-NGgoCzZA';


// Valida si el navegador tiene la Geolocalización activa o no
if ( !navigator.geolocation){
  alert('Navegador no soporta la Geolocalización');
  throw new Error('Navegador no soporta la Geolocalización');
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

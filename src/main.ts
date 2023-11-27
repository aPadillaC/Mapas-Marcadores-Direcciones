import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


// Valida si el navegador tiene la Geolocalización activa o no
if ( !navigator.geolocation){
  alert('Navegador no soporta la Geolocalización');
  throw new Error('Navegador no soporta la Geolocalización');
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

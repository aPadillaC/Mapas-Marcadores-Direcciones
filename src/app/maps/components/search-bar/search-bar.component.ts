import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  // Variable para el debounce Manual
  private debounceTimer?: NodeJS.Timeout;

  constructor () {  }



  // Metodo para realizar la petición cuando el usuario deja de teclear por 350 milesimas de segundos
  onQueryChanged( query: string = '') {

    if( this.debounceTimer ) clearTimeout( this.debounceTimer )

    this.debounceTimer = setTimeout(() => {

    }, 350)

  }
}

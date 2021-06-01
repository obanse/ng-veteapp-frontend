import {Component} from '@angular/core';

import {Tile} from './tile.model';

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.css']
})
export class MainGridComponent {

  tiles: Tile[] = [
    {title: 'Betriebe', path: '/companies'},
    {title: 'CC-Kontrollen', path: '/cc-controls'},
    {title: 'Einstellungen', path: '/'},
    {title: 'Administration', path: '/'},
  ];
}

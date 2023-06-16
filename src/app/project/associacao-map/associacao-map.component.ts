import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AssociationService } from '../../../services/association.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-associacao-map',
  templateUrl: './associacao-map.component.html',
  styleUrls: ['./associacao-map.component.scss']
})
export class AssociacaoMapComponent implements OnInit, AfterViewInit {

  loggesdUser: any;
  loggedtAssociation: any;

  private _map: any;

  private _initMap() {
    this._map = L.map('map', {
      center: [1, 1],
      zoom: 3,
    })
  }

  constructor(
    private readonly _authService: AuthService,
    private readonly _associationService: AssociationService,
  ) { }

  ngAfterViewInit(): void {
    this._initMap();
  }

  async ngOnInit() {
    this.loggesdUser = await this._authService.getAuthenticatedUser();
    this.loggedtAssociation = await this._associationService.getById(this.loggesdUser.id);
  }

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: L.latLng(-5.79448, -35.211)
  };
  layers = [
    L.circle([-5.79448, -35.211], { radius: 5000 }),
    L.polygon([[-5.79448, -35.211], [-5.79448, -35.211], [-5.79448, -35.211]]),
    L.marker([-5.79448, -35.211])
  ];

  layersControl = {
    baseLayers: {
      'Open Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      'Open Cycle Map': L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'Big Circle': L.circle([46.95, -122], { radius: 5000 }),
      'Big Square': L.polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
    }
  }

}

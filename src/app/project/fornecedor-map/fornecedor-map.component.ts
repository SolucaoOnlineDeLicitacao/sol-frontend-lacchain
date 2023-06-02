import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-fornecedor-map',
  templateUrl: './fornecedor-map.component.html',
  styleUrls: ['./fornecedor-map.component.scss']
})
export class FornecedorMapComponent {

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


import { Component, AfterViewInit } from '@angular/core';
import * as L from "leaflet";
import { AllLicitacao } from 'src/services/association-licitacao.mock';
import { AuthService } from 'src/services/auth.service';
import { licitacaoList } from 'src/services/association-licitacao.mock';
import { Router } from '@angular/router';
import { DatamockService } from 'src/services/datamock.service';
import { AssociationService } from 'src/services/association.service';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  licitacoes: any = [];
  associationList!: AssociationResponseDto[];

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
  licitacoesList!: any[];
  currentPage: number = 1;
  itensPerPage: number = 6;

  constructor(
    private datamockService: DatamockService,
    public authService: AuthService,
    private router: Router,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private _associationBidService: AssociationBidService,
  ) {
  }

  ngAfterViewInit(): void {
    this.licitacoesList = this.datamockService.licitacoes;

    if (this.authService.getAuthenticatedUser().type == 'associacao') {
      this.ngxSpinnerService.show();
      this._associationBidService.list().subscribe({
        next: data => {
          this.ngxSpinnerService.hide();
          this.licitacoes = data;
        }
      })
    }
  }

  goLicitacoes() {

    this.router.navigate(['/pages/fornecedor/licitacoes']);
  }

  detailBidsAsAssociation(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-data', i._id]);
  }

  detailBids(i: any) {
    this.router.navigate(['/pages/fornecedor/detalhes-licitacoes']);
    localStorage.setItem('licitacao', JSON.stringify(i));
  }

}
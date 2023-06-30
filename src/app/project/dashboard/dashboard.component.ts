
import { Component, AfterViewInit } from '@angular/core';
import * as L from "leaflet";
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { AssociationService } from 'src/services/association.service';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';

import { ToastrService } from 'ngx-toastr';

import { DashbordService } from 'src/services/dashboard.service';
import { DashboardResponseDto } from 'src/dtos/dashboard/dashboard-response.dto';
import { SupplierService } from '../../../services/supplier.service';
import { SupplierRequestDto } from '../../../dtos/supplier/supplier-request.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  licitacoes: any = [];
  licitacoesSearchFormore: any = [];
  associationList!: AssociationResponseDto[];
  fornecedorList!: SupplierRequestDto[];

  map: L.DrawMap;

  licitacoesId: any;
  licitacoesList: any[];
  currentPage: number = 1;
  itensPerPage: number = 10;

  responseDashboard: DashboardResponseDto = {
    associationRegister: 0,
    bidInProgress: 0,
    supplierRegister: 0
  }

  constructor(
    public authService: AuthService,
    private router: Router,
    private associationService: AssociationService,
    private _supplierService: SupplierService,
    private ngxSpinnerService: NgxSpinnerService,
    private _associationBidService: AssociationBidService,

    private toastrService: ToastrService,

    private dashboardService: DashbordService

  ) {
  }

  ngAfterViewInit(): void {

    this.ngxSpinnerService.show();

    if (this.authService.getAuthenticatedUser().type == 'fornecedor') {
      this._associationBidService.listForSupplier().subscribe({
        next: (data: any[]) => {
          this.licitacoesList = data
          this.licitacoesId = data;
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      });
    }

    if (this.authService.getAuthenticatedUser().type == 'administrador') {

      this.map = L.map('map').setView([-23.6820635, -46.924961], 8);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this._associationBidService.list().subscribe({
        next: (data: any[]) => {
          this.licitacoesSearchFormore = data.filter((item) =>
            item.modality === 'openClosed' && item.status === 'open').sort((a: any, b: any) =>
              b.bid_count - a.bid_count);
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      });
    }

    if (this.authService.getAuthenticatedUser().type == 'associacao') {
      // this.ngxSpinnerService.show();
      this._associationBidService.list().subscribe({
        next: data => {
          this.ngxSpinnerService.hide();
          this.licitacoes = data.sort((a: any, b: any) => b.bid_count - a.bid_count);

        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      })
    }

  }

  ngOnInit(): void {

    if (this.authService.getAuthenticatedUser().type == 'administrador') {

      this.dashboardService.getData().subscribe({
        next: data => {
          this.responseDashboard = data
        }
      });

      this.associationService.list().subscribe({
        next: response => {
          this.associationList = response;
          this.associationList.map(item => {
            this.addMarker(
              item.name,
              `/pages/associacao/dados-associacao/${item._id}`,
              item.address.latitude,
              item.address.longitude,
              'association',
            );
          })
        }
      });

      this._supplierService.supplierList().subscribe({
        next: response => {
          this.fornecedorList = response;
          this.fornecedorList.map(item => {
            this.addMarker(
              item.name,
              `/pages/fornecedor/dados-fornecedor/${item._id}`,
              item.address.latitude,
              item.address.longitude,
              'fornecedor',
            )
          })
        }
      });
    }
  }

  goLicitacoes() {

    this.licitacoesList = this.licitacoesSearchFormore;
  }

  detailBidsAsAssociation(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-data', i._id]);
  }

  detailBids(i: any) {
    this.router.navigate(["/pages/fornecedor/licitacoes/detalhes-licitacoes/" + i._id]);
  }

  associationDetailBids(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-data', i._id]);
    localStorage.setItem('licitacao', JSON.stringify(i));
  }

  editBids(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-edit', i._id]);
  }

  addMarker(name: string, link: string, lat: string, lng: string, type: string) {

    let icon: L.Icon<L.IconOptions>;

    switch (type) {
      case 'association':
        icon = L.icon({
          iconUrl: '../../../assets/markers/blue.png',
          iconSize: [36, 59],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        });
        break;
      default:
        icon = L.icon({
          iconUrl: '../../../assets/markers/green.png',
          iconSize: [36, 59],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        })
        break;
    }

    L.marker(
      [+lat, +lng],
      { icon: icon })
      .bindPopup(
        `<a href='${link}'>${name}</a>`)
      .addTo(this.map);
  }
}
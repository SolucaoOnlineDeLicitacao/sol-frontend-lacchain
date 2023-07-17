import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AuthService } from 'src/services/auth.service';
import { DatamockService } from 'src/services/datamock.service';
import { AdministrationSetTimeComponent } from './administration-set-time/administration-set-time.component';

@Component({
  selector: 'app-administration-licitacoes',
  templateUrl: './administration-licitacoes.component.html',
  styleUrls: ['./administration-licitacoes.component.scss']
})
export class AdministrationLicitacoesComponent {
  licitacoesList: any = [];
  licitacoesListFilter: any = [];
  currentPage: number = 1;
  itensPerPage: number = 5;
  selectedFilterOption: string = "listAll"

  searchTool = false;
  search: string = ''

  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);

    this.spinnerService.show();
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesListFilter = this.licitacoesList = data
        this.spinnerService.hide();
      },
      error: error => {
        console.error(error);
        this.spinnerService.hide();
      }
    })

  }

  openRegisterTime() {
    this.modalService.open(AdministrationSetTimeComponent, { centered: true });
  }

  detailBids(i: any) {
    this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
  }

  filter(event: any) {
    this.search = event.target.value;
    this.licitacoesListFilter = this.licitacoesList.filter(
      (item: any) => {
        if (this.selectedFilterOption === 'listAll' || this.selectedFilterOption === 'descending') {
          return item.association?.email?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.document?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.name?.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!this.search.length) return item.status === this.selectedFilterOption

        if (this.search.length && item.status === this.selectedFilterOption) {
          return item.association?.email?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.document?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.name?.toLowerCase().includes(this.search.toLowerCase())
        }
      }
    );
  }

  changeSelectedFilter(event: any) {
    this.selectedFilterOption = event.target.value;

    const object = {
      target: {
        value: this.search
      }
    }
    this.filter(object)
  }

}

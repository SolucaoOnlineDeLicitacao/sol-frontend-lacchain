import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AuthService } from 'src/services/auth.service';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-administration-licitacoes',
  templateUrl: './administration-licitacoes.component.html',
  styleUrls: ['./administration-licitacoes.component.scss']
})
export class AdministrationLicitacoesComponent {
  licitacoesList: any = [];
  currentPage: number = 1;
  itensPerPage: number = 5;
  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);

    this.spinnerService.show();
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesList = data;
        this.spinnerService.hide();
      },
      error: error => {
        this.spinnerService.hide();
      }
    })

  }

  detailBids(i: any) {
    this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
  }

}

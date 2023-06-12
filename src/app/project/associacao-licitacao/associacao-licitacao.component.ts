import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { licitacaoList } from 'src/services/association-licitacao.mock';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-associacao-licitacao',
  templateUrl: './associacao-licitacao.component.html',
  styleUrls: ['./associacao-licitacao.component.scss']
})
export class AssociacaoLicitacaoComponent {
  licitacoesList: any = [];

  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private ngxSpinnerService: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this._associationBidService.list().subscribe({
      next: data => {
        this.ngxSpinnerService.hide();
        this.licitacoesList = data;
      }
    })

  }

  detailBids(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-data', i._id]);
  }

  editBids(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-edit', i._id]);
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatamockService } from 'src/services/datamock.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-administration-contracts-licitacao',
  templateUrl: './administration-contracts-licitacao.component.html',
  styleUrls: ['./administration-contracts-licitacao.component.scss']
})
export class AdministrationContractsLicitacaoComponent {

  constructor(
    public datamock: DatamockService,
    private location: Location,
    private router: Router,

  ) { }
  ngOnInit(): void {

  }

  goBackDetail() {
    this.location.back();
  }

}


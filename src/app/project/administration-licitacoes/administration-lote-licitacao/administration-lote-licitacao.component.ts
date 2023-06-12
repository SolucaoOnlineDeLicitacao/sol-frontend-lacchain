import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-administration-lote-licitacao',
  templateUrl: './administration-lote-licitacao.component.html',
  styleUrls: ['./administration-lote-licitacao.component.scss']
})
export class AdministrationLoteLicitacaoComponent {
  constructor(
    public datamock: DatamockService,
    private router: Router
  ) { }
  ngOnInit(): void {

  }

  open(value: string){
    if(value === 'proposal'){
      this.router.navigate(['/pages/proposal-screening/proposal-accepted']);
    }
  }
}


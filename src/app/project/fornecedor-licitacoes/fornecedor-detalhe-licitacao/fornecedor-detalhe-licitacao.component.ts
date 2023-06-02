import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatamockService } from 'src/services/datamock.service';
import { CancelarLicitacaoComponent } from '../../administration-licitacoes/administration-detail-licitacao/cancelar-licitacao/cancelar-licitacao.component';
import { FracassarLicitacaoComponent } from '../../administration-licitacoes/administration-detail-licitacao/fracassar-licitacao/fracassar-licitacao.component';
import { RecusarLicitacaoComponent } from '../../administration-licitacoes/administration-detail-licitacao/recusar-licitacao/recusar-licitacao.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fornecedor-detalhe-licitacao',
  templateUrl: './fornecedor-detalhe-licitacao.component.html',
  styleUrls: ['./fornecedor-detalhe-licitacao.component.scss']
})
export class FornecedorDetalheLicitacaoComponent {

  oneStep: number | null = null;
  loteList: any;
  constructor(
    public datamock: DatamockService,
    private toastrService: ToastrService,
    private router: Router

  ) { }
  ngOnInit(): void {
    this.loteList = this.datamock.lotes
  }


  openDetail(value: number) {
    if (this.oneStep === value) this.oneStep = null;
    else this.oneStep = value;
  }

  openModal(command: string) {
    if (command === 'edital') this.toastrService.success('Baixado com sucesso!', '', { progressBar: true });
  }

  delete(i: any): void {
    const trash = this.loteList.findIndex((lote: any) => lote._id === i._id);
    if (trash !== -1) this.loteList.splice(trash, 1);
  }

  viewProposal(i: any[], value: string){
    if(value === 'proposal')this.router.navigate(['/pages/fornecedor/proposta']);
    if(value === 'edit') this.router.navigate(['/pages/fornecedor/proposta/atualizar']);
    if(value === 'create') {
      localStorage.setItem('enviarproposta', JSON.stringify(value));
      this.router.navigate(['/pages/fornecedor/proposta/enviar']);
    }
    if(value === 'send') {
      localStorage.setItem('enviarproposta',JSON.stringify(value));
      this.router.navigate(['/pages/fornecedor/proposta/enviar']);
    }
    
    localStorage.setItem('lote', JSON.stringify(i));

  
  }

}

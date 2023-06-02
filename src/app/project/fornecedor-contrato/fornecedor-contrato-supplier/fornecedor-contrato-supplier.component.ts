import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatamockService } from 'src/services/datamock.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fornecedor-contrato-supplier',
  templateUrl: './fornecedor-contrato-supplier.component.html',
  styleUrls: ['./fornecedor-contrato-supplier.component.scss']
})
export class FornecedorContratoSupplierComponent {
 
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

  openModal(command: string) {
    if (command === 'aceitar') this.toastrService.success('Aceito com sucesso!', '', { progressBar: true });
    if (command === 'recusar') this.toastrService.error('Recusado com sucesso!', '', { progressBar: true });
    if (command === 'edital') this.toastrService.success('Baixado com sucesso!', '', { progressBar: true });

    if(command === 'proposal') this.router.navigate(['/pages/fornecedor/detalhes-licitacoes']);
  }

}

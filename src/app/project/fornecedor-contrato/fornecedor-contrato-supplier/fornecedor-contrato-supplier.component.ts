import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatamockService } from 'src/services/datamock.service';
import { ToastrService } from 'ngx-toastr';
import { ContractsService } from 'src/services/contract.service';
import { ContractResponseDto } from 'src/dtos/contratos/convenio-response.dto';
import { acceptSupplierDto } from 'src/dtos/contratos/acceptSupplier';
import { singAssociationDto } from 'src/dtos/contratos/sing-association';

@Component({
  selector: 'app-fornecedor-contrato-supplier',
  templateUrl: './fornecedor-contrato-supplier.component.html',
  styleUrls: ['./fornecedor-contrato-supplier.component.scss']
})

export class FornecedorContratoSupplierComponent {
 
  oneStep: number | null = null;
  request: acceptSupplierDto;
  request1: singAssociationDto;
  association: singAssociationDto;
  fornecedorId: any ;
  id: string
  loteList: any = {
    "deleted": null,
    "_id": null,
    "contract_number": null,
    "bid_number": null,
    "supplier_id": null,
    "value": null,
    "status": null,
    "createdAt": null,
    "updatedAt": null,
    "__v": 0
} ;
  
 
  constructor(
    public datamock: DatamockService,
    private toastrService: ToastrService,
    private router: Router,
    private contractsService: ContractsService,
    private route: ActivatedRoute

  ) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['_id'];
      this.contractsService.getContractById(this.id).subscribe({
        next: (data) => {
          this.loteList = data
          console.log(this.loteList)
        },
        error: error => {
          console.error(error)
        }
      })
    })
    
    /* this.loteList = this.datamock.lotes */
  }

  openModal(command: string) {
    if (command === 'aceitar') this.toastrService.success('Aceito com sucesso!', '', { progressBar: true });
    if (command === 'recusar') this.toastrService.error('Recusado com sucesso!', '', { progressBar: true });
    if (command === 'edital') this.toastrService.success('Baixado com sucesso!', '', { progressBar: true });

    if(command === 'proposal') this.router.navigate(['/fornecedor/licitacoes/detalhes-licitacoes/'+this.id]);
  }

  accept(){
   
     this.acceptSupplier();

  }

  async acceptSupplier() {
    this.request1 ={
      status : 'concluido',
      association_id: this.loteList.association_id
    };
    console.log(this.request1)
    this.contractsService.singSupplier(this.id ,this.request1).subscribe(
      async success =>{
        this.toastrService.success('Aceito com sucesso!', '', { progressBar: true });
        this.loteList.supplier_accept = 'true'
      },
      async error => {
        this.toastrService.error('Erro ao aceitar', '', { progressBar: true });
      }
    )
  }

  async acceptVisit() {
    this.request ={
      status : 'concluido',
      
    };
    console.log('aceitar',this.request)
    this.contractsService.updateStatus(this.id ,this.request).subscribe(
      async success =>{
        this.toastrService.error('Aceito com sucesso!', '', { progressBar: true });
      },
      async error => {
        this.toastrService.error('Erro ao aceitar', '', { progressBar: true });
      }
    )
  }

}

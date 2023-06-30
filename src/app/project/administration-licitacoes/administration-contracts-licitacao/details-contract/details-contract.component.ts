import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContractStatusEnum } from 'src/enums/contract-status.enum';
import { ContractsService } from 'src/services/contract.service';

@Component({
  selector: 'app-details-contract',
  templateUrl: './details-contract.component.html',
  styleUrls: ['./details-contract.component.scss']
})
export class DetailsContractComponent {

  loteList: any ={}

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private contractsService: ContractsService,
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
  
  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.route.params.subscribe(params => {
      const id = params["_id"];
      this.contractsService.getContractById(id).subscribe({
        next: data => {
          this.loteList = data;
          this.ngxSpinnerService.hide();
        },
        error: error => {
          console.error(error);
        },
      });
    });
  }

  handlerStatus(status: string) {
    switch (status) {
      case ContractStatusEnum.aguardando_assinaturas:
        return "Aguardando assinaturas";
      case ContractStatusEnum.aguardando_fornecedor:
        return "Aguardando fornecedor";
      case ContractStatusEnum.assinado:
        return "Assinado";
      case ContractStatusEnum.concluido:
        return "Concluído";
      case ContractStatusEnum.executado_parcialmente:
        return "Executado parcialmente";
      case ContractStatusEnum.inexecucao_total:
        return "Inexecução total";
      default:
        return "-";
    }
  }
  
}

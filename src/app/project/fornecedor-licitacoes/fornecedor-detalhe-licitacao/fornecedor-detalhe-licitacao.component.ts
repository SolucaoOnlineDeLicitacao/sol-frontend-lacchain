import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatamockService } from 'src/services/datamock.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { AllotmentsService } from 'src/services/allotments.service';
import { forkJoin } from 'rxjs';
import { AllotmentResponseDto } from 'src/dtos/allotment/allotment-response.dto';
import { AuthService } from 'src/services/auth.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { SupplierService } from 'src/services/supplier.service';
import { ProposalService } from 'src/services/proposal.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-fornecedor-detalhe-licitacao',
  templateUrl: './fornecedor-detalhe-licitacao.component.html',
  styleUrls: ['./fornecedor-detalhe-licitacao.component.scss']
})
export class FornecedorDetalheLicitacaoComponent {

  oneStep: number | null = null;
  loteListIndex: any;
  loteList: any[];
  response: any;
  associationName: UserListResponseDto;
  listLote: AllotmentResponseDto[];

  proposals: any = []
  reviwerInfo: any;
 
  constructor(
    public datamock: DatamockService,
    private router: Router,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private alloments: AllotmentsService,
    private userService: UserService,
    private supplierService: SupplierService,
    private proposalService: ProposalService

  ) { }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.response = data["bid"];
        console.log(this.response, 'dados da licitação')
      }
    })

    this.userService.getById(this.response?.agreement?.reviewer).subscribe({
      next: (data) => {
        this.reviwerInfo = data;
      },
      error: (error: any) => {
        console.log(error)
      }
    });

    // for (let iterator of this.response.invited_suppliers) {
    //   this.supplierService.getById(iterator).subscribe({
    //     next: data => {
    //       Object.assign(this.response, { fornecedor: data })
    //     }
    //   })
    // }

    this.proposalService.listProposalByBid(this.response._id).subscribe({
      next: data => {
        console.log(data)
        this.proposals = data
      }
    })
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

  viewProposal(i: any, value: string) {
    if (value === 'proposal') this.router.navigate(['/pages/fornecedor/proposta']);
    if (value === 'edit') this.router.navigate(['/pages/fornecedor/proposta/atualizar']);
    if (value === 'create') {
      Object.assign(this.response, { typeSend: 'create' });
      localStorage.setItem('enviarproposta', JSON.stringify(this.response));
      this.router.navigate(['/pages/fornecedor/proposta/enviar']);
    }
    if (value === 'send') {
      Object.assign(this.response, { typeSend: 'send' });
      localStorage.setItem('enviarproposta', JSON.stringify(this.response));
      this.router.navigate(['/pages/fornecedor/proposta/enviar']);
    }

    localStorage.setItem('lote', JSON.stringify(i));


  }

}

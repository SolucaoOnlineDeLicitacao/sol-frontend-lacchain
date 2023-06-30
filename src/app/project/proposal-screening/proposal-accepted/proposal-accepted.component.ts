import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalService } from 'src/services/proposal.service';
import * as XLSX from 'xlsx';
import { RecusarPropostaModalComponent } from '../../associacao-licitacao-view-proposal/components/recusar-proposta-modal/recusar-proposta-modal.component';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-proposal-accepted',
  templateUrl: './proposal-accepted.component.html',
  styleUrls: ['./proposal-accepted.component.scss']
})
export class ProposalAcceptedComponent {

  responseBid: any;
  haveAccept: Boolean = false;
  responseProposal: any;

  constructor(
    private proposalService: ProposalService,
    private userService: UserService,
    private modalService: NgbModal,
    private translate: TranslateService,

    private location: Location,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    let response: any = localStorage.getItem('bidResponse');
    this.responseBid = JSON.parse(response);
    this.proposalService.listProposalByBid(this.responseBid._id).subscribe({
      next: data => {
        this.responseProposal = data;
        this.responseProposal.proposals.sort((a: any, b: any) => {
          if (a.status === 'aceitoAssociacao') {
            return -1;
          }
          if (b.status === 'aceitoAssociacao') {
            return 1;
          }
          return 0;
        });
      },
      error: error => {
        console.error(error)
      }
    })
  }

  open() {
    const base64String = this.responseProposal.file;
    const nomeArquivo = 'planilha.xlsx';

    const arquivoDecodificado = atob(base64String);

    const bytes = new Uint8Array(arquivoDecodificado.length);
    for (let i = 0; i < arquivoDecodificado.length; i++) {
      bytes[i] = arquivoDecodificado.charCodeAt(i);
    }

    const workbook = XLSX.read(bytes, { type: 'array' });

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const excelUrl = URL.createObjectURL(excelBlob);

    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = nomeArquivo;

    link.click();

    URL.revokeObjectURL(excelUrl);
  }

  refused(pro: any) {
    localStorage.setItem('proposalAction', JSON.stringify(pro))
    const modalRef = this.modalService.open(RecusarPropostaModalComponent, { centered: true });
    modalRef.result.then(data => {
    }, error => {
      this.location.back();
    });
  }

  approve(_id: string) {
    this.proposalService.acceptProposal(_id).subscribe({
      next: data => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_ACCEPT_PROPOSAL'), '', { progressBar: true });
        this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_ACCEPT_PROPOSAL'), '', { progressBar: true });
      }
    })
  }

}

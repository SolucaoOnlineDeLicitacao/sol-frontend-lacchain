import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalService } from 'src/services/proposal.service';
import * as XLSX from 'xlsx';
import { RecusarPropostaModalComponent } from '../../associacao-licitacao-view-proposal/components/recusar-proposta-modal/recusar-proposta-modal.component';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-proposal-accepted',
  templateUrl: './proposal-accepted.component.html',
  styleUrls: ['./proposal-accepted.component.scss']
})
export class ProposalAcceptedComponent {

  responseBid: any;

  responseProposal: any;

  constructor(
    private proposalService: ProposalService,
    private modalService: NgbModal,
    private location: Location,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    let response: any = localStorage.getItem('bidResponse');
    this.responseBid = JSON.parse(response);

    console.log(this.responseBid)

    this.proposalService.getProposalAcceptByBid(this.responseBid._id).subscribe({
      next: data => {
        this.responseProposal = data;
        console.log(data);
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

  refused() {
    localStorage.setItem('proposalAction', JSON.stringify(this.responseProposal))
    const modalRef = this.modalService.open(RecusarPropostaModalComponent, { centered: true });
    modalRef.result.then(data => {
    }, error => {
      this.location.back();
    });
  }

  approve() {
    this.proposalService.acceptProposal(this.responseProposal._id).subscribe({
      next: data => {
        console.log(data);
        this.toastrService.success('Proposta aceita com sucesso', '', { progressBar: true });
        this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error('Erro ao aceitar proposta', '', { progressBar: true })

      }
    })
  }

}

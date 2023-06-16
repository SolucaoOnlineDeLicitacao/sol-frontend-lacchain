import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProposalNotificationInterface } from 'src/app/interface/proposal-notification.interface';
import { ProposalService } from 'src/services/proposal.service';

@Component({
  selector: 'app-aceitar-proposta-modal',
  templateUrl: './aceitar-proposta-modal.component.html',
  styleUrls: ['./aceitar-proposta-modal.component.scss']
})
export class AceitarPropostaModalComponent {

  response: ProposalNotificationInterface;

  constructor(
    private modalService: NgbModal,
    private proposalService: ProposalService,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    let response: any = localStorage.getItem('proposalAction');
    this.response = JSON.parse(response);
  }

  confirm() {

    this.proposalService.acceptProposal(this.response._id, this.response).subscribe({
      next: data => {
        console.log(data);
        this.toastrService.success('Proposta aceita com sucesso', '', { progressBar: true });
        this.exit();
      },
      error: error => {
        console.error(error);
        this.toastrService.error('Erro ao aceitar proposta', '', { progressBar: true })

      }
    })
  }

  exit() {
    this.modalService.dismissAll()
  }

  ngOnDestroy() {
    localStorage.removeItem('proposalAction')
  }

}

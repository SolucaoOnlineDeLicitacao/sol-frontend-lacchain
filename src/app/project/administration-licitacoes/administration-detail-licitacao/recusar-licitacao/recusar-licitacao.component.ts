import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';

@Component({
  selector: 'app-recusar-licitacao',
  templateUrl: './recusar-licitacao.component.html',
  styleUrls: ['./recusar-licitacao.component.scss']
})
export class RecusarLicitacaoComponent implements OnInit {

  responseId: any;

  constructor(
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private bidService: AssociationBidService,
    private router: Router
  ) { }
  ngOnInit(): void {
    let bid: any = localStorage.getItem('bidId');
    this.responseId = bid;
  }
  closeModal(value: string) {
    this.modalService.dismissAll();
  }

  confirm() {
    let request = {
      status: 'deserted'
    }

    this.bidService.changeStatus(this.responseId, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success('Recusada com sucesso!', '', { progressBar: true });
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(['/pages/licitacoes'])
          });
        }
      },
      error: error => {
        this.toastrService.error('Erro ao recusar licitação!', '', { progressBar: true });
      }
    })
  }

  ngOnDestroy() {
    localStorage.removeItem('bid')
  }
}

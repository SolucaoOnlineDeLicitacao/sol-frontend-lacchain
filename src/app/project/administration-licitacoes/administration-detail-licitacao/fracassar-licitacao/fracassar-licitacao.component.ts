import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';

@Component({
  selector: 'app-fracassar-licitacao',
  templateUrl: './fracassar-licitacao.component.html',
  styleUrls: ['./fracassar-licitacao.component.scss']
})
export class FracassarLicitacaoComponent implements OnInit {

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
    if (value === 'failbids') {
      this.toastrService.success('Fracassado com sucesso!', '', { progressBar: true });
    }
  }

  confirm() {
    let request = {
      status: 'failed'
    }

    this.bidService.changeStatus(this.responseId, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success('Fracassada com sucesso!', '', { progressBar: true });
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(['/pages/licitacoes'])
          });
        }
      },
      error: error => {
        this.toastrService.error('Erro ao fracassar licitação!', '', { progressBar: true });
      }
    })
  }

  ngOnDestroy() {
    localStorage.removeItem('bid')
  }
}

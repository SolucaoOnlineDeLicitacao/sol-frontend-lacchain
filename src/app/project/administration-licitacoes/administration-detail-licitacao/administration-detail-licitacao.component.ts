import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatamockService } from 'src/services/datamock.service';
import { FracassarLicitacaoComponent } from './fracassar-licitacao/fracassar-licitacao.component';
import { RecusarLicitacaoComponent } from './recusar-licitacao/recusar-licitacao.component';
import { CancelarLicitacaoComponent } from './cancelar-licitacao/cancelar-licitacao.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';

@Component({
  selector: 'app-administration-detail-licitacao',
  templateUrl: './administration-detail-licitacao.component.html',
  styleUrls: ['./administration-detail-licitacao.component.scss']
})
export class AdministrationDetailLicitacaoComponent {

  oneStep = true;
  twoStep = false;
  threeStep = false;
  fourStep = false;
  fiveStep = false;
  sixStep = false;
  sevenStep = false;

  response: any;

  prazoEmdias: number;

  constructor(
    public datamock: DatamockService,
    private modalService: NgbModal,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private bidService: AssociationBidService

  ) { }
  ngOnInit(): void {

    this.spinnerService.show();
    this.route.data.subscribe({
      next: (data) => {
        this.response = data["bid"];
        this.spinnerService.hide();
      }
    })

    this.prazoEmdias = this.calcularPrazoEmDias(this.response.start_at, this.response.end_at)

  }

  detailBids(i: any) {

  }

  calcularPrazoEmDias(prazoInicial: any, prazoFinal: any) {
    const dataInicial = new Date(prazoInicial);
    const dataFinal = new Date(prazoFinal);

    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);

    return diferencaEmDias;
  }

  openModal(command: string, item: any) {
    if (item !== null) {
      localStorage.setItem('bidId', item._id)
    }
    if (command === 'onefailbids') this.modalService.open(FracassarLicitacaoComponent, { centered: true, backdrop: 'static', keyboard: false })
    if (command === 'recusa') this.modalService.open(RecusarLicitacaoComponent, { centered: true, backdrop: 'static', keyboard: false })
    if (command === 'cancel') this.modalService.open(CancelarLicitacaoComponent, { centered: true, backdrop: 'static', keyboard: false })
    if (command === 'lote') this.router.navigate(['/pages/licitacoes/lote-licitacoes'])
    if (command === 'proposal') this.router.navigate(['/pages/proposal-screening/proposal-accepted'])
    if (command === 'contract') this.router.navigate(['/pages/licitacoes/contratos-licitacoes'])
    if (command === 'edital') this.toastrService.success('Baixado com sucesso!', '', { progressBar: true });

  }

  releasedBid() {
    let request = {
      status: 'released'
    }


    this.bidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success('Lançada com sucesso!', '', { progressBar: true });
        this.response.status = 'released';
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
          });
        }
      },
      error: error => {
        this.toastrService.error('Erro ao lançar licitação!', '', { progressBar: true });
      }
    })
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AllLicitacao, licitacaoList } from 'src/services/association-licitacao.mock';
import { AssociationService } from 'src/services/association.service';
import { AuthService } from 'src/services/auth.service';
import { AllSuppliers, supplierList } from 'src/services/supplier.mock';

@Component({
  selector: 'app-associacao-licitacao-data',
  templateUrl: './associacao-licitacao-data.component.html',
  styleUrls: ['./associacao-licitacao-data.component.scss']
})
export class AssociacaoLicitacaoDataComponent {

  licitacao!: AllLicitacao | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;
  isSectionOneOpen: boolean = false;
  isSectionTwoOpen: boolean = false;

  response: any;
  prazoEmdias: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private associationBidService: AssociationBidService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [''],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.response = data["bid"];
      }
    })
    // const licitacaoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    // this.licitacao = licitacaoList.find(licitacao => licitacao._id === licitacaoId);

    this.prazoEmdias = this.calcularPrazoEmDias(this.response.start_at, this.response.end_at)
  }

  calcularPrazoEmDias(prazoInicial: any, prazoFinal: any) {
    const dataInicial = new Date(prazoInicial);
    const dataFinal = new Date(prazoFinal);

    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);

    return diferencaEmDias;
  }

  open(contentBlocked: any) {
    this.modalService.open(contentBlocked, { size: 'lg' });
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: 'lg' });
  }

  exit() {
    this.modalService.dismissAll();
  }

  toggleSectionOne() {
    this.isSectionOneOpen = !this.isSectionOneOpen;
  }

  toggleSectionTwo() {
    this.isSectionTwoOpen = !this.isSectionTwoOpen;
  }

  cancelStatus() {
    let request = {
      status: 'canceled'
    }
    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success('Licitação cancelada com sucesso!', '', { progressBar: true });
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(['/pages/associacao/licitacoes'])
          });
        }
      },
      error: error => {
        this.toastrService.error('Erro ao recusar licitação!', '', { progressBar: true });
      }
    })
  }



}

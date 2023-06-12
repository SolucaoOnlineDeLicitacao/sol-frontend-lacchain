import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AllLicitacao, licitacaoList } from 'src/services/association-licitacao.mock';
import { AssociationService } from 'src/services/association.service';
import { AuthService } from 'src/services/auth.service';
import { AllSuppliers, supplierList } from 'src/services/supplier.mock';
import { SupplierService } from 'src/services/supplier.service';
import { UserService } from 'src/services/user.service';

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
  invitedSuppliersIds: any;
  invitedSuppliersInfo: any;
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
    private userService: UserService,
    private supplierService: SupplierService
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [''],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.response = data["bid"];
        console.log(this.response);
        this.invitedSuppliersIds = this.response.invited_suppliers;
        this.findSuppliersById();
        this.response.add_allotment.forEach((allotment: any) => {
          allotment.isSectionOpen = false;
        });
      }
    })
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

  toggleSectionOne(allotment: any) {
    allotment.isSectionOpen = !allotment.isSectionOpen;
  }

  toggleSectionTwo() {
    this.isSectionTwoOpen = !this.isSectionTwoOpen;
  }

  findSuppliersById() {
    const observables = this.invitedSuppliersIds.map((id: string) => this.supplierService.getById(id));

    forkJoin(observables).subscribe({
      next: (responses) => {
        console.log(responses);
        this.invitedSuppliersInfo = responses;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  cancelStatus() {
    let request = {
      status: 'canceled'
    }
    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success('Licitação cancelada com sucesso!', '', { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(['/pages/associacao/licitacoes']);
          });
        }
      },
      error: error => {
        this.toastrService.error('Erro ao recusar licitação!', '', { progressBar: true });
      }
    })
  }

  downloadFile(base64: string) {
    const byteCharacters = atob(base64.substr(base64.indexOf(',') + 1));
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file.pdf';
    link.click();
  }

}

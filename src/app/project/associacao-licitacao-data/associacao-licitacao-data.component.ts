import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { AllotmentsService } from "src/services/allotments.service";
import { AssociationBidService } from "src/services/association-bid.service";
import { AuthService } from "src/services/auth.service";
import { SupplierService } from "src/services/supplier.service";

@Component({
  selector: "app-associacao-licitacao-data",
  templateUrl: "./associacao-licitacao-data.component.html",
  styleUrls: ["./associacao-licitacao-data.component.scss"],
})
export class AssociacaoLicitacaoDataComponent {
  licitacao!: any | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;
  isSectionOneOpen: boolean = false;
  isSectionTwoOpen: boolean = false;
  invitedSuppliersIds: any;
  invitedSuppliersInfo: any;
  response: any;
  prazoEmdias: number;
  allAllotmentsList: any;
  date = new Date();

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private associationBidService: AssociationBidService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
    private supplierService: SupplierService,
    private allotmentsService: AllotmentsService,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [""],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.response = data["bid"];
      },
    });
    this.prazoEmdias = this.calcularPrazoEmDias(this.response.start_at, this.response.end_at);
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
    this.modalService.open(contentBlocked, { size: "lg" });
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: "lg" });
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
      next: responses => {
        this.invitedSuppliersInfo = responses;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  cancelStatus() {
    let request = {
      status: "canceled",
    };
    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success("Licitação cancelada com sucesso!", "", { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(["/pages/associacao/licitacoes"]);
          });
        }
      },
      error: error => {
        this.toastrService.error("Erro ao recusar licitação!", "", { progressBar: true });
      },
    });
  }

  acceptStatus() {
    let request = {
      status: BidStatusEnum.awaiting,
    };
    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success("Licitação enviada com sucesso!", "", { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(["/pages/associacao/licitacoes"]);
          });
        }
      },
      error: error => {
        this.toastrService.error("Erro ao recusar licitação!", "", { progressBar: true });
      },
    });
  }

  downloadFile(base64: string) {
    const byteCharacters = atob(base64.substr(base64.indexOf(",") + 1));
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "file.pdf";
    link.click();
  }

  download(_id: string) {
    this.allotmentsService.download(_id).subscribe((response: any) => {
      console.log('response', response)
      const blob = new Blob([response], { type: 'application/pdf' });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'file.pdf';
      // link.click();
    });


  }

  getFileName(filePath: string): string {
    const splited = filePath.split('/');
    return splited[splited.length - 1];
  }

  getClassStatus(status: string) {
    return '';
  }

  goViewProposals() {
    this.router.navigate([`associacao/licitacoes/view-proposal/${this.response._id}`])
  }

  async downloadEdital(){
    if(!this.response.editalFile){
      this.toastrService.error("Não há edital para essa licitação!", "", { progressBar: true });
      return;
    }

    const result = await this.associationBidService.download(this.response._id, 'editalFile');

    const file = new Blob([result], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  async downloadAta(){
    if(!this.response.ataFile){
      this.toastrService.error("Não há ata para essa licitação!", "", { progressBar: true });
      return;
    }
    
    const result = await this.associationBidService.download(this.response._id, 'ataFile');

    const file = new Blob([result], {type: 'application/pdf'});
    const url = window.URL.createObjectURL(file);
    window.open(url);
  }
}

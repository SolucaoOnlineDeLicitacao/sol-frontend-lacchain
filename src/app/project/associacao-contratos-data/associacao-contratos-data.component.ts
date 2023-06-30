import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConvenioResponseDto } from "src/dtos/convenio/convenio-response.dto";
import { AuthService } from "src/services/auth.service";
import { ConvenioService } from "src/services/convenio.service";
import { ContractsService } from "../../../services/contract.service";
import { ToastrService } from "ngx-toastr";
import { UpdateContractModalComponent } from "./update-contract-modal/update-contract-modal.component";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-associacao-contratos-data",
  templateUrl: "./associacao-contratos-data.component.html",
  styleUrls: ["./associacao-contratos-data.component.scss"],
})
export class AssociacaoContratosDataComponent {
  convenio!: any | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  totalValue: number = 0;

  storedLanguage : string | null

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public ontractsService: AuthService,
    private contractsService: ContractsService,
    private toastrService: ToastrService,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [""],
    });
  }

  ngOnInit(): void {
    const convenioId = this.activatedRoute.snapshot.paramMap.get("id");
    if (!convenioId) return;
    this.contractsService.getContractById(convenioId).subscribe({
      next: data => {
        this.convenio = data;

        let quantity: number = 0
        for (let iterator of data.proposal_id.allotment) {
          quantity = iterator.add_item.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) + quantity;
        }
        this.totalValue = data.value / quantity;
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  open(contentBlocked: any) {
    this.modalService.open(contentBlocked, { size: "lg" });
  }

  openUpdateContractModal() {
    const modalRef = this.modalService.open(UpdateContractModalComponent, { centered: true });
    modalRef.componentInstance.response = this.convenio;
    modalRef.result.then(data => {
      this.contractsService.getContractById(this.convenio._id).subscribe({
        next: data => {
          this.convenio = data;
          let quantity: number = 0
          for (let iterator of data.proposal_id.allotment) {
            quantity = iterator.add_item.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) + quantity;
          }
          this.totalValue = data.value / quantity;
        }
      });
    }, error => {
      this.contractsService.getContractById(this.convenio._id).subscribe({
        next: data => {
          this.convenio = data;
          let quantity: number = 0
          for (let iterator of data.proposal_id.allotment) {
            quantity = iterator.add_item.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) + quantity;
          }
          this.totalValue = data.value / quantity;
        }
      });
    });
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: "lg" });
  }

  exit() {
    this.modalService.dismissAll();
  }

  isSectionOpen: boolean = false;

  toggleSection() {
    this.isSectionOpen = !this.isSectionOpen;
  }

  refused() { }

  approve() {
    this.contractsService
      .singAssociation(this.convenio?._id!, { status: "concluido", association_id: this.convenio?.association! })
      .subscribe({
        next: async success => {

          let successMessage = 'Aceito com sucesso!';

          switch(this.storedLanguage) {
            case 'pt': 
              successMessage = 'Aceito com sucesso!'
              break;
            case 'en':
              successMessage = 'Successfully accepted!'
              break;
            case 'fr':
              successMessage = 'Accepté avec succès !'
              break;
            case 'es':
              successMessage = '¡Aceptado con éxito!'
              break;
          }

          this.toastrService.success(successMessage, "", { progressBar: true });
          const convenioId = this.activatedRoute.snapshot.paramMap.get("id");
          if (!convenioId) return;
          this.contractsService.getContractById(convenioId).subscribe({
            next: data => {
              this.convenio = data;

              let quantity: number = 0
              for (let iterator of data.proposal_id.allotment) {
                quantity = iterator.add_item.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) + quantity;
              }
              this.totalValue = data.value / quantity;
            }
          });
        },
        error: async error => {
          
          let errorMessage = 'Erro ao aceitar';

          switch(this.storedLanguage) {
            case 'pt': 
              errorMessage = 'Erro ao aceitar'
              break;
            case 'en':
              errorMessage = 'Error accepting'
              break;
            case 'fr':
              errorMessage = "Erreur d'acceptation"
              break;
            case 'es':
              errorMessage = 'Error al aceptar'
              break;
          }

          this.toastrService.error(errorMessage, "", { progressBar: true });
        },
      });
  }

  async downloadPdf() {
    try {
      const pdfDownaload = await this.contractsService.getPdf(this.convenio._id);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pdfDownaload;

      if (tempDiv) {
        html2canvas(document.body.appendChild(tempDiv)).then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
        
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const marginLeft = 10;
          const marginTop = 10;
        
          pdf.addImage(imgData, 'PNG', marginLeft, marginTop, pdfWidth - (2 * marginLeft), pdfHeight - (2 * marginTop));
        
          const pdfDataUri = pdf.output('datauristring');
          const link = document.createElement('a');
          link.href = pdfDataUri;
          link.download = 'contrato.pdf';
          link.click();
        
          document.body.removeChild(tempDiv);
        });
      }
    } catch {

      let errorMessage = 'Modelo de contrato não cadastrado';

      switch(this.storedLanguage) {
        case 'pt': 
          errorMessage = 'Modelo de contrato não cadastrado'
          break;
        case 'en':
          errorMessage = 'Unregistered contract template'
          break;
        case 'fr':
          errorMessage = "Modèle de contrat non enregistré"
          break;
        case 'es':
          errorMessage = 'Modelo de contrato no registrado'
          break;
      }

      this.toastrService.error(errorMessage, "", { progressBar: true });
    }

  }
}

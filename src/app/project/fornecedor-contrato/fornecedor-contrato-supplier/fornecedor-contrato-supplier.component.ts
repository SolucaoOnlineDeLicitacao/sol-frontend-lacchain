import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DatamockService } from "src/services/datamock.service";
import { ToastrService } from "ngx-toastr";
import { ContractsService } from "src/services/contract.service";

import { acceptSupplierDto } from "src/dtos/contratos/acceptSupplier";
import { singAssociationDto } from "src/dtos/contratos/sing-association";
import { ContractStatusEnum } from "src/enums/contract-status.enum";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { LanguageContractEnum } from "src/enums/language-contract.enum";

@Component({
  selector: "app-fornecedor-contrato-supplier",
  templateUrl: "./fornecedor-contrato-supplier.component.html",
  styleUrls: ["./fornecedor-contrato-supplier.component.scss"],
})
export class FornecedorContratoSupplierComponent {
  oneStep: number | null = null;
  request: acceptSupplierDto;
  request1: singAssociationDto;
  association: singAssociationDto;
  fornecedorId: any;
  id: string;
  loteList: any = {
    deleted: null,
    _id: null,
    contract_number: null,
    bid_number: null,
    supplier_id: null,
    value: null,
    status: null,
    createdAt: null,
    updatedAt: null,
    __v: 0,
  };

  constructor(
    public datamock: DatamockService,
    private toastrService: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private contractsService: ContractsService,
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.route.params.subscribe(params => {
      this.id = params["_id"];
      this.contractsService.getContractById(this.id).subscribe({
        next: data => {
          this.loteList = data;
          this.ngxSpinnerService.hide();
        },
        error: error => {
          console.error(error);
        },
      });
    });
  }

  openModal(command: string) {
    if (command === "aceitar") this.toastrService.success("Aceito com sucesso!", "", { progressBar: true });
    if (command === "recusar") this.toastrService.error("Recusado com sucesso!", "", { progressBar: true });
    if (command === "edital") this.toastrService.success("Baixado com sucesso!", "", { progressBar: true });

    if (command === "proposal")
      this.router.navigate(["/fornecedor/licitacoes/detalhes-licitacoes/" + this.loteList.bid_number._id]);
  }

  accept() {
    this.acceptSupplier();
  }

  async acceptSupplier() {
    this.request1 = {
      status: "concluido",
      association_id: this.loteList.association_id,
    };
    this.contractsService.singSupplier(this.id, this.request1).subscribe({
      next: async success => {
        this.toastrService.success(this.translate.instant("TOASTRS.ACCEPT_SUCCESS"), "", { progressBar: true });
        this.loteList.supplier_accept = "true";
        this.ngOnInit();
      },
      error: async error => {
        this.toastrService.error(this.translate.instant("TOASTRS.ACCEPT_ERROR"), "", { progressBar: true });
      },
    });
  }

  async acceptVisit() {
    this.request = {
      status: "concluido",
    };
    this.contractsService.updateStatus(this.id, this.request).subscribe({
      next: async success => {
        this.toastrService.success(this.translate.instant("TOASTRS.ACCEPT_SUCCESS"), "", { progressBar: true });
      },
      error: async error => {
        this.toastrService.success(this.translate.instant("TOASTRS.ACCEPT_ERROR"), "", { progressBar: true });
      },
    });
  }

  handlerStatus(status: string) {
    switch (status) {
      case ContractStatusEnum.aguardando_assinaturas:
        return "Aguardando assinaturas";
      case ContractStatusEnum.aguardando_fornecedor:
        return "Aguardando fornecedor";
      case ContractStatusEnum.assinado:
        return "Assinado";
      case ContractStatusEnum.concluido:
        return "Concluído";
      case ContractStatusEnum.executado_parcialmente:
        return "Executado parcialmente";
      case ContractStatusEnum.inexecucao_total:
        return "Inexecução total";
      default:
        return "-";
    }
  }

  async downloadPdf() {
    try {
      const selectedLanguage = this.translate.currentLang;
      let language;
      switch (selectedLanguage) {
        case "pt":
          language = LanguageContractEnum.portuguese;
          break;
        case "en":
          language = LanguageContractEnum.english;
          break;
        case "es":
          language = LanguageContractEnum.spanish;
          break;
        case "fr":
          language = LanguageContractEnum.french;
          break;
        default:
          language = LanguageContractEnum.english;
          break;
      }

      this.contractsService
        .getPdf(this.id.toString(), language, this.loteList.bid_number.classification)
        .then(data => {
          const buffer = data;
          const file = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const fileURL = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = fileURL;
          const name =
            this.loteList.bid_number.bid_count + "/" + new Date(this.loteList.bid_number.createdAt).getFullYear();
          link.setAttribute("download", `Contract-${name}.docx`);
          link.style.display = "none"; // Oculta o link no DOM
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error(error);
          this.toastrService.error(this.translate.instant("TOASTRS.DOWNLOAD_ERROR"), "", { progressBar: true });
        });

      // const pdfDownaload = await this.contractsService.getPdf(this.id.toString());

      // const tempDiv = document.createElement('div');
      // tempDiv.innerHTML = pdfDownaload;

      // if (tempDiv) {
      //   html2canvas(document.body.appendChild(tempDiv)).then((canvas) => {
      //     const pdf = new jsPDF('p', 'mm', 'a4');

      //     const imgData = canvas.toDataURL('image/png');
      //     const pdfWidth = pdf.internal.pageSize.getWidth();
      //     const pdfHeight = pdf.internal.pageSize.getHeight();
      //     const marginLeft = 10;
      //     const marginTop = 10;

      //     pdf.addImage(imgData, 'PNG', marginLeft, marginTop, pdfWidth - (2 * marginLeft), pdfHeight - (2 * marginTop));

      //     const pdfDataUri = pdf.output('datauristring');
      //     const link = document.createElement('a');
      //     link.href = pdfDataUri;
      //     link.download = 'contrato.pdf';
      //     link.click();

      //     document.body.removeChild(tempDiv);
      //   });
      // }
    } catch {}
  }
}

import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatamockService } from "src/services/datamock.service";
import { FracassarLicitacaoComponent } from "./fracassar-licitacao/fracassar-licitacao.component";
import { RecusarLicitacaoComponent } from "./recusar-licitacao/recusar-licitacao.component";
import { CancelarLicitacaoComponent } from "./cancelar-licitacao/cancelar-licitacao.component";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { AssociationBidService } from "src/services/association-bid.service";
import { BidTypeEnum } from "src/enums/bid-type.enum";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-administration-detail-licitacao",
  templateUrl: "./administration-detail-licitacao.component.html",
  styleUrls: ["./administration-detail-licitacao.component.scss"],
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
      next: data => {
        this.response = data["bid"];
        this.spinnerService.hide();
      },
    });

    this.prazoEmdias = this.calcularPrazoEmDias(this.response.start_at, this.response.end_at);
  }

  detailBids(i: any) { }

  calcularPrazoEmDias(prazoInicial: any, prazoFinal: any) {
    const dataInicial = new Date(prazoInicial);
    const dataFinal = new Date(prazoFinal);

    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);

    return diferencaEmDias;
  }

  async openModal(command: string, item: any = this.response) {
    if (this.response !== null) {
      localStorage.setItem("bidId", this.response._id);
    }
    if (command === "onefailbids")
      this.modalService.open(FracassarLicitacaoComponent, { centered: true, backdrop: "static", keyboard: false });
    if (command === "recusa")
      this.modalService.open(RecusarLicitacaoComponent, { centered: true, backdrop: "static", keyboard: false });
    if (command === "cancel")
      this.modalService.open(CancelarLicitacaoComponent, { centered: true, backdrop: "static", keyboard: false });
    if (command === "lote") {
      localStorage.setItem("lotes", JSON.stringify(this.response));
      this.router.navigate(["/pages/licitacoes/lote-licitacoes"]);
    }
    if (command === "proposal") {
      localStorage.setItem("bidResponse", JSON.stringify(item));
      this.router.navigate(["/pages/proposal-screening/proposal-accepted"]);
    }
    if (command === "contract") this.router.navigate(["/pages/licitacoes/contratos-licitacoes"]);

    if (command === "edital") {
      //const result = await this.bidService.download(this.response._id, "editalFile");

      //const file = new Blob([result], { type: "application/pdf" });
      //const fileURL = URL.createObjectURL(file);
      //window.open(fileURL);
      //this.toastrService.success("Baixado com sucesso!", "", { progressBar: true });
      const pdfDownaload = await this.bidService.bidPdf(this.response._id, 'De Edital');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pdfDownaload;

      if (tempDiv) {
        html2canvas(document.body.appendChild(tempDiv)).then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
        
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight() / 2;
          const marginLeft = 10;
          const marginTop = 10;
        
          const maxFontSize = 12;
          const lineHeight = 1.2;
        
          const footerSpacing = 10; 
        
          const text = tempDiv.innerText;
          const textLines = pdf.splitTextToSize(text, pdfWidth - marginLeft * 2);
        
          let fontSize = maxFontSize;
          let textHeight = (1) * pdf.internal.scaleFactor;
        
          let startY = marginTop;
          let remainingText = textLines;
        
          while (remainingText.length) {
            if (startY + textHeight > pdfHeight - marginTop - footerSpacing) {
              pdf.addPage();
              startY = marginTop;
            }
        
            const availableSpace = pdfHeight - startY - marginTop - footerSpacing;
            const maxLines = Math.floor(availableSpace / textHeight);
            const textPage = remainingText.splice(0, maxLines);
            const footerY = pdf.internal.pageSize.getHeight() - footerSpacing;
        
            pdf.text(textPage, marginLeft, startY);
            startY += textPage.length * textHeight;
            
            if (startY + textHeight > pdfHeight - marginTop) {
              pdf.text('', marginLeft, footerY);
            }
          }
        
          const pdfDataUri = pdf.output('datauristring');
          const link = document.createElement('a');
          link.href = pdfDataUri;
          link.download = 'edital.pdf';
          link.click();
        
          document.body.removeChild(tempDiv);
        });
      }
    }

    if (command === 'dados_complementares') {
      const result = await this.bidService.download(this.response._id, "ataFile").toPromise();

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;

        if (typeof result === 'string') {
          const array = JSON.parse(result);

          for (let dados of array) {

            const pdfData = new Uint8Array(dados.result.data);
            const file = new Blob([pdfData], { type: 'application/pdf' });

            const fileURL = URL.createObjectURL(file);

            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.download = 'arquivoComplementar.pdf';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }

        } else {
          console.error('Error ao ler o pdf..');
        }
      };

      reader.onerror = (event: ProgressEvent<FileReader>) => {
        console.error('Error ao ler o pdf.');
      };

      reader.readAsText(result);

      //window.open(fileURL);
      //this.toastrService.success("Baixado com sucesso!", "", { progressBar: true });
    }
    if (command === "ata") {
      //const result = await this.bidService.download(this.response._id, "ataFile");
      //
      //const file = new Blob([result], { type: "application/pdf" });
      //const fileURL = URL.createObjectURL(file);
      //window.open(fileURL);
      //this.toastrService.success("Baixado com sucesso!", "", { progressBar: true });
      const pdfDownaload = await this.bidService.bidPdf(this.response._id, 'De Ata');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pdfDownaload;

      if (tempDiv) {
        html2canvas(document.body.appendChild(tempDiv)).then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
        
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight() / 2;
          const marginLeft = 10;
          const marginTop = 10;
        
          const maxFontSize = 12;
          const lineHeight = 1.2;
        
          const footerSpacing = 10; 
        
          const text = tempDiv.innerText;
          const textLines = pdf.splitTextToSize(text, pdfWidth - marginLeft * 2);
        
          let fontSize = maxFontSize;
          let textHeight = (1) * pdf.internal.scaleFactor;
        
          let startY = marginTop;
          let remainingText = textLines;
        
          while (remainingText.length) {
            if (startY + textHeight > pdfHeight - marginTop - footerSpacing) {
              pdf.addPage();
              startY = marginTop;
            }
        
            const availableSpace = pdfHeight - startY - marginTop - footerSpacing;
            const maxLines = Math.floor(availableSpace / textHeight);
            const textPage = remainingText.splice(0, maxLines);
            const footerY = pdf.internal.pageSize.getHeight() - footerSpacing;
        
            pdf.text(textPage, marginLeft, startY);
            startY += textPage.length * textHeight;
            
            if (startY + textHeight > pdfHeight - marginTop) {
              pdf.text('', marginLeft, footerY);
            }
          }
        
          const pdfDataUri = pdf.output('datauristring');
          const link = document.createElement('a');
          link.href = pdfDataUri;
          link.download = 'ata.pdf';
          link.click();
        
          document.body.removeChild(tempDiv);
        });
      }
    }
  }

  releasedBid() {
    let request = {
      status: "released",
    };

    this.bidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        const toastr = this.toastrService.success("Lançada com sucesso!", "", { progressBar: true });
        this.response.status = "released";
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
          });
        }
      },
      error: error => {
        this.toastrService.error("Erro ao lançar licitação!", "", { progressBar: true });
      },
    });
  }

  handlerBidType(type: string) {
    if (type === BidTypeEnum.individualPrice) return "Preço Individual";
    if (type === BidTypeEnum.allotmentPrice) return "Preço Lote";
    if (type === BidTypeEnum.globalPrice) return "Preço Global";
    return "-";
  }
}

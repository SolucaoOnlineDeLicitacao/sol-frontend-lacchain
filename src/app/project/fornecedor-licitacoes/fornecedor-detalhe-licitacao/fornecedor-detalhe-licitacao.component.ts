import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserListResponseDto } from "src/dtos/user/user-list-response.dto";
import { AllotmentResponseDto } from "src/dtos/allotment/allotment-response.dto";
import { LocalStorageService } from "src/services/local-storage.service";
import { ProposalService } from "src/services/proposal.service";
import { AssociationBidService } from "src/services/association-bid.service";
import { TranslateService } from "@ngx-translate/core";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-fornecedor-detalhe-licitacao",
  templateUrl: "./fornecedor-detalhe-licitacao.component.html",
  styleUrls: ["./fornecedor-detalhe-licitacao.component.scss"],
})
export class FornecedorDetalheLicitacaoComponent {
  oneStep: number | null = null;
  loteListIndex: any;
  loteList: any[];
  response: any;
  associationName: UserListResponseDto;
  listLote: AllotmentResponseDto[];
  map: Map<number, number> = new Map();
  storedLanguage: string | null
  proposals: any = [];
  reviwerInfo: any;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private bidService: AssociationBidService,

    private proposalService: ProposalService,
    private associationBidService: AssociationBidService
  ) { }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.response = data["bid"];
        this.reviwerInfo = this.response?.agreement?.reviewer || {};
        this.proposalService.listProposalByBid(this.response._id).subscribe({
          next: data => {
            this.proposals = data;
          },
        });

        this.getVerify();
      },
    });
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  openDetail(value: number) {
    if (!this.map.has(value)) {
      this.map.set(value, value);
    } else {
      this.map.delete(value);
    }
  }

  async openModal(command: string) {
    if (command === "edital") {
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
      //const result = await this.associationBidService.download(this.response._id, "editalFile");
      //const file = new Blob([result], { type: "application/pdf" });
      //const fileURL = URL.createObjectURL(file);
      //window.open(fileURL);
      //this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DOWNLOAD'), '', { progressBar: true });
    }
    if (command === "ata") {
      try {

        const pdfDownaload = await this.associationBidService.bidPdf(this.response._id, 'De Ata');

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
      } catch {

        let errorMessage = 'Modelo de contrato não cadastrado';

        switch (this.storedLanguage) {
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

      //const result = await this.associationBidService.download(this.response._id, "ataFile");
      //const file = new Blob([result], { type: "application/pdf" });
      //const url = window.URL.createObjectURL(file);
      //window.open(url);
      //this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DOWNLOAD'), '', { progressBar: true });
    }
    if(command === 'arquivoComplementar'){
      const result = await this.bidService.download(this.response._id, "ataFile").toPromise();

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        
        if (typeof result === 'string') {
          const array = JSON.parse(result);
     
          for(let dados of array){
            
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
    }
  }

  delete(i: any): void {
    const trash = this.loteList.findIndex((lote: any) => lote._id === i._id);
    if (trash !== -1) this.loteList.splice(trash, 1);
  }

  viewProposal(i: any, value: string) {
    if (value === "proposal") this.router.navigate(["/pages/fornecedor/proposta"]);
    if (value === "edit") this.router.navigate(["/pages/fornecedor/proposta/atualizar"]);
    if (value === "create") {
      Object.assign(this.response, { typeSend: "create" });
      localStorage.setItem("enviarproposta", JSON.stringify(this.response));
      this.router.navigate(["/pages/fornecedor/proposta/enviar"]);
    }
    if (value === "send") {
      Object.assign(this.response, { typeSend: "send" });
      localStorage.setItem("enviarproposta", JSON.stringify(this.response));
      this.router.navigate(["/pages/fornecedor/proposta/enviar"]);
    }

    localStorage.setItem("lote", JSON.stringify(i));
  }

  handlerInProposal(id: string): boolean {
    return this.proposals?.proposals?.some((proposal: any) => {
      return proposal?.allotment?.some((allotment: any) => allotment._id === id);
    });
  }

  getVerify() {
    for (let iterator of this.response.add_allotment) {
      this.proposalService.getProposalVerify(iterator._id).subscribe({
        next: data => {
          if (data === true) {
            iterator = Object.assign(iterator, { disabledBtn: true });
          }
        },
      });
    }
  }

  updateProposal(id: string) {
    const proposal = this.proposals?.proposals?.find((proposal: any) => {
      return proposal?.allotment?.some((allotment: any) => allotment._id === id);
    });
    if (proposal) {
      this.router.navigate(["/pages/fornecedor/proposta/atualizar/" + proposal._id]);
    }
  }

  async downloadComplentary(){
    
    const result = await this.bidService.download(this.response._id, "ataFile").toPromise();

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        
        if (typeof result === 'string') {
          const array = JSON.parse(result);
     
          for(let dados of array){
            
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

  }
}

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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  storedLanguage: string | null

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private associationBidService: AssociationBidService,
    private bidService: AssociationBidService,
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

    this.storedLanguage = localStorage.getItem('selectedLanguage');
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
  async openModal(command: string, item: any = this.response) {
    if (this.response !== null) {
      localStorage.setItem("bidId", this.response._id);
    }

    if (command === "contract") this.router.navigate(["/pages/licitacoes/contratos-licitacoes"]);

  
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

        let successMessage = 'Licitação cancelada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Licitação cancelada com sucesso!'
            break;
          case 'en':
            successMessage = 'Bid canceled successfully!'
            break;
          case 'fr':
            successMessage = 'Enchère annulée avec succès !'
            break;
          case 'es':
            successMessage = '¡Puja cancelada con éxito!'
            break;
        }

        const toastr = this.toastrService.success(successMessage, "", { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(["/pages/associacao/licitacoes"]);
          });
        }
      },
      error: error => {

        let errorMessage = 'Erro ao recusar licitação!';

        switch (this.storedLanguage) {
          case 'pt':
            errorMessage = 'Erro ao recusar licitação!'
            break;
          case 'en':
            errorMessage = 'Error rejecting bid!'
            break;
          case 'fr':
            errorMessage = "Erreur lors du rejet de l'enchère !"
            break;
          case 'es':
            errorMessage = '¡Error al rechazar la oferta!'
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
      },
    });
  }

  acceptStatus() {
    let request = {
      status: BidStatusEnum.awaiting,
    };
    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {

        let successMessage = 'Licitação enviada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Licitação enviada com sucesso!'
            break;
          case 'en':
            successMessage = 'Bid sent successfully!'
            break;
          case 'fr':
            successMessage = 'Enchère envoyée avec succès !'
            break;
          case 'es':
            successMessage = '¡Oferta enviada con éxito!'
            break;
        }

        const toastr = this.toastrService.success(successMessage, "", { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(["/pages/associacao/licitacoes"]);
          });
        }
      },
      error: error => {

        let errorMessage = 'Erro ao recusar licitação!';

        switch (this.storedLanguage) {
          case 'pt':
            errorMessage = 'Erro ao recusar licitação!'
            break;
          case 'en':
            errorMessage = 'Error rejecting bid!'
            break;
          case 'fr':
            errorMessage = "Erreur lors du rejet de l'enchère !"
            break;
          case 'es':
            errorMessage = '¡Error al rechazar la oferta!'
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
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
  async downloadEdital() {
    //if (!this.response.editalFile) {
//
    //  let errorMessage = 'Não há edital para essa licitação!';
//
    //  switch (this.storedLanguage) {
    //    case 'pt':
    //      errorMessage = 'Não há edital para essa licitação!'
    //      break;
    //    case 'en':
    //      errorMessage = 'There is no public notice for this tender!'
    //      break;
    //    case 'fr':
    //      errorMessage = "Il n'y a pas d'avis public pour cet appel d'offres !"
    //      break;
    //    case 'es':
    //      errorMessage = '¡No hay aviso público para esta licitación!'
    //      break;
    //  }
//
    //  this.toastrService.error(errorMessage, "", { progressBar: true });
    //  return;
    //}

    //const result = await this.associationBidService.download(this.response._id, 'editalFile');
    //console.log(result);
    //const file = new Blob([result], {type: 'application/pdf'});
    //const fileURL = URL.createObjectURL(file);
    //window.open(fileURL);

    try {

      const pdfDownaload = await this.associationBidService.bidPdf(this.response._id, 'De Edital');

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
    } catch {

      let errorMessage = 'Modelo de edital não cadastrado';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'Modelo de edital não cadastrado'
          break;
        case 'en':
          errorMessage = 'Unregistered bid/tender notice template'
          break;
        case 'fr':
          errorMessage = "Modèle d'avis d'appel d'offres non enregistré"
          break;
        case 'es':
          errorMessage = 'Modelo de convocatoria no registrado'
          break;
      }

      this.toastrService.error(errorMessage, "", { progressBar: true });
    }
  }

  async downloadAta() {
   //if (!this.response.ataFile) {

   //  let errorMessage = 'Não há ata para essa licitação!';

   //  switch (this.storedLanguage) {
   //    case 'pt':
   //      errorMessage = 'Não há ata para essa licitação!'
   //      break;
   //    case 'en':
   //      errorMessage = 'There are no minutes for this bid!'
   //      break;
   //    case 'fr':
   //      errorMessage = "Il n'y a pas de minutes pour cette enchère !"
   //      break;
   //    case 'es':
   //      errorMessage = '¡No hay minutos para esta oferta!'
   //      break;
   //  }

   //  this.toastrService.error(errorMessage, "", { progressBar: true });
   //  return;
   //}

   //const result = await this.associationBidService.download(this.response._id, 'ataFile');

   //const file = new Blob([result], { type: 'application/pdf' });
   //const url = window.URL.createObjectURL(file);
   //window.open(url);
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
  }
}

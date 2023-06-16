import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatamockService } from 'src/services/datamock.service';
import { Location } from '@angular/common';
import { SupplierService } from 'src/services/supplier.service';
import { ProposalService } from 'src/services/proposal.service';

@Component({
  selector: 'app-fornecedor-enviar-proposta',
  templateUrl: './fornecedor-enviar-proposta.component.html',
  styleUrls: ['./fornecedor-enviar-proposta.component.scss']
})
export class FornecedorEnviarPropostaComponent {
  @ViewChild('fretealarm') fretealarm: ElementRef;
  @ViewChild('doc', { static: true }) fileInput: ElementRef<HTMLInputElement>;
  form: FormGroup;
  formDoc: FormGroup;
  notImage = true;
  docName: string;
  FRETEaLERT = 'Valor do frete'
  create: string;
  PDFaLERT = false;
  docs = false;
  docsINput = true;
  response: any;

  fornecedor: any;

  docForSend: any;

  constructor(
    public datamock: DatamockService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private location: Location,
    private proposalService: ProposalService
  ) {
    this.formDoc = this.formBuilder.group({
      doc: ['', [Validators.required]],
    });
    this.form = this.formBuilder.group({
      frete: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    let response: any = localStorage.getItem('enviarproposta');
    this.response = JSON.parse(response);


    if (this.response.typeSend === 'create') {
      this.create = 'create'
    } else {
      this.create = 'send'
    }



    console.log('response', this.response);

  }

  backProposal() {
    if (this.form.controls['frete'].value === '' || this.form.controls['frete'].value === null) {
      this.fretealarm.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.FRETEaLERT = 'Valor do frete necessário'
      setInterval(() => {
        this.fretealarm.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.FRETEaLERT = 'Valor do frete'
      }, 3000);
    } else {
      this.toastrService.success('Atualizado com sucesso!', '', { progressBar: true });
      this.location.back();
    }
  }

  backProposalDetail() {

    this.toastrService.success('Enviado com sucesso!', '', { progressBar: true });
    this.location.back();
  }

  confirm() {
    if (this.response.typeSend === 'create') {
      let request = {
        total_value: this.form.controls['frete'].value,
        licitacaoId: this.response._id,
        allotmentIds: this.response.add_allotment[0]._id
      }

      this.proposalService.register(request).subscribe({
        next: data => {
          this.toastrService.success('Proposta enviada com sucesso!', '', { progressBar: true })
          this.location.back();
        },
        error: error => {
          this.toastrService.error('Erro ao enviar proposta!', '', { progressBar: true })
          console.error(error)
        }
      })

    } else {
      let request = {
        file: this.docForSend,
        licitacaoId: this.response._id,
        allotmentIds: this.response.add_allotment[0]._id
      }

      this.proposalService.register(request).subscribe({
        next: data => {
          this.toastrService.success('Proposta enviada com sucesso!', '', { progressBar: true })
          this.location.back();
        },
        error: error => {
          this.toastrService.error('Erro ao enviar proposta!', '', { progressBar: true })
          console.error(error)
        }
      })
    }
  }


  deleteDoc() {
    this.docName = '';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.docs = false;
    this.docsINput = true;
  }


  download() {
    this.toastrService.success('Baixado com sucesso!', '', { progressBar: true });
  }

  fileSelected(event: any) {
    const doc: File = event.target.files[0];
    const pdf = /(\.pdf)$/i;
    this.docs = true;
    this.docName = doc.name
    this.docsINput = false;
    this.readFile(doc);
  }

  readFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const contents = e.target.result;
      this.convertToBase64(contents);
    };

    reader.readAsBinaryString(file);
  }

  convertToBase64(contents: string) {
    const base64 = btoa(contents);
    this.docForSend = base64;
  }
}

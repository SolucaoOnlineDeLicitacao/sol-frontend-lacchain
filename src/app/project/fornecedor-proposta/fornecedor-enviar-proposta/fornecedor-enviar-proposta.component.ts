import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatamockService } from 'src/services/datamock.service';
import { Location } from '@angular/common';

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
  create = this.datamock.getDataProposal();
  PDFaLERT = false;
  docs = false;
  docsINput = true;
  constructor(
    public datamock: DatamockService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private location: Location,
  ) {
    this.formDoc = this.formBuilder.group({
      doc: ['', [Validators.required]],
    });
    this.form = this.formBuilder.group({
      frete: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
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




  deleteDoc() {
    this.docName = '';
    if(this.fileInput) this.fileInput.nativeElement.value = '';
    this.docs = false;
    this.docsINput = true;

  }
  download() {
    this.toastrService.success('Baixado com sucesso!', '', { progressBar: true });
  }

  // função completa do img marketing/xequemate-backoffice
  fileSelected(event: any) {
    const doc: File = event.target.files[0];
    const pdf = /(\.pdf)$/i;
    this.docs = true;
    this.docName = doc.name
    this.docsINput = false;
  }
}

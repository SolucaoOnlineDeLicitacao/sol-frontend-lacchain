import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-fornecedor-atualizar-proposta',
  templateUrl: './fornecedor-atualizar-proposta.component.html',
  styleUrls: ['./fornecedor-atualizar-proposta.component.scss']
})
export class FornecedorAtualizarPropostaComponent {
  @ViewChild('fretealarm') fretealarm: ElementRef;
  form: FormGroup;
  FRETEaLERT = 'Valor do frete'
  constructor(
    public datamock: DatamockService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private location: Location,
  ) {
    this.form = this.formBuilder.group({
      frete: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.form.patchValue({
      frete: this.datamock.getDataLote().frete,
    });
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
}

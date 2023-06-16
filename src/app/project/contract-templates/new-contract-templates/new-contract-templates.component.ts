import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';
import { ModelContractService } from 'src/services/model-contract.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-new-contract-templates',
  templateUrl: './new-contract-templates.component.html',
  styleUrls: ['./new-contract-templates.component.scss']
})
export class NewContractTemplatesComponent {
  form: FormGroup;
  licitacoesList: any = [];

  html: '';
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private _modelContractService:ModelContractService,
    private toastrService: ToastrService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      licitacoes: [''],
      contract: [''],
    })
  }

  ngOnInit(): void {
  
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesList = data;
      },
    })
   
  }

  onSubmit() {
   
    let dto = {
      name : this.form.value.name ,
      bid: this.form.value.licitacoes,
      contract: this.form.value.contract
    }
    
    this._modelContractService.modelContractRegister(dto).subscribe({
      next: (success) => {
        this.toastrService.success('Modelo de contrato cadastrado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/modelo-contratos'])
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  backContract() {
    this.router.navigate(['/pages/modelo-contratos'])
  }

}

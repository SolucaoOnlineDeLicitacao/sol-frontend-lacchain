import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModelContractDto } from 'src/dtos/model-contract/model-contract.copy';
import { AssociationBidService } from 'src/services/association-bid.service';
import { ModelContractService } from 'src/services/model-contract.service';

@Component({
  selector: 'app-edit-contract-templates',
  templateUrl: './edit-contract-templates.component.html',
  styleUrls: ['./edit-contract-templates.component.scss']
})
export class EditContractTemplatesComponent {

  form: FormGroup;
  templateList!: ModelContractDto;
  licitacoesList: any = [];
  modelContractId!: string;
  isSectionOpenFornecedor: boolean = false;
  isSectionOpenAssociacao: boolean = false;
  isSectionOpenContrato: boolean = false;
  isSectionOpenConvenio: boolean = false;
  isSectionOpenLicitacao: boolean = false;
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

  storedLanguage: string | null

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private _modelContractService: ModelContractService,
    private activatedRoute: ActivatedRoute,
    private _associationBidService: AssociationBidService,
    private toastrService: ToastrService,
  ) {
    this.form = this.formBuilder.group({
      _id: [''],
      name: [''],
      classification: [''],
      contract: ['']
    })
  }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this._modelContractService.getById(params['_id']).subscribe({
        next: (success) => {
          this.modelContractId = success._id;
          this.form.patchValue({
            _id: success._id,
            name: success.name,
            classification: success.classification,
            contract: success.contract
          });

        }
      })
    })
    this.ngxSpinnerService.hide();

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

  onSubmit() {

    let dto = {
      name: this.form.value.name,
      classification: this.form.value.classification,
      contract: this.form.value.contract
    }

    this._modelContractService.updateModelContract(this.modelContractId, dto).subscribe({
      next: (success) => {

        let successMessage = 'Modelo de contrato atualizado com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Modelo de contrato atualizado com sucesso!'
            break;
          case 'en':
            successMessage = 'Contract template successfully updated!'
            break;
          case 'fr':
            successMessage = 'Modèle de contrat mis à jour avec succès !'
            break;
          case 'es':
            successMessage = '¡Plantilla de contrato actualizada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/modelo-contratos'])
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  toggleSectionFornecedor() {
    if (this.isSectionOpenFornecedor) {
      this.isSectionOpenFornecedor = false
    } else {
      this.isSectionOpenFornecedor = true
    }
  }

  toggleSectionAssociacao() {
    if (this.isSectionOpenAssociacao) {
      this.isSectionOpenAssociacao = false
    } else {
      this.isSectionOpenAssociacao = true
    }
  }

  toggleSectionContrato() {
    if (this.isSectionOpenContrato) {
      this.isSectionOpenContrato = false
    } else {
      this.isSectionOpenContrato = true
    }
  }

  toggleSectionConvenio() {
    if (this.isSectionOpenConvenio) {
      this.isSectionOpenConvenio = false
    } else {
      this.isSectionOpenConvenio = true
    }
  }

  toggleSectionLicitacao() {
    if (this.isSectionOpenLicitacao) {
      this.isSectionOpenLicitacao = false
    } else {
      this.isSectionOpenLicitacao = true
    }
  }

  backContact() {
    this.router.navigate(['/pages/modelo-contratos'])
  }

}

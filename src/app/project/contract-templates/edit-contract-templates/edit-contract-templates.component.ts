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
    private ngxSpinnerService: NgxSpinnerService,
    private _modelContractService:ModelContractService,
    private activatedRoute: ActivatedRoute,
    private _associationBidService: AssociationBidService,
    private toastrService: ToastrService,
  ){
    this.form = this.formBuilder.group({
      _id: [''],
      name: [''],
      licitacoes: [''],
      contract: ['']
    })
  }

  ngOnInit(): void {
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesList = data;
      },
    })

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this._modelContractService.getById(params['_id']).subscribe({
        next: (success) => {
          this.modelContractId = success. _id;
          this.form.patchValue({
            _id: success. _id,
            name: success.name,
            licitacoes: success.bid,
            contract: success.contract
          });
      
        }
      })
    })
    this.ngxSpinnerService.hide();
  
 }

 onSubmit() {
   
  let dto = {
    name : this.form.value.name ,
    bid: this.form.value.licitacoes,
    contract:this.form.value.contract
  }
 
  this._modelContractService.updateModelContract(this.modelContractId, dto).subscribe({
    next: (success) => {
      this.toastrService.success('Modelo de contrato atualizado com sucesso!', '', { progressBar: true });
      this.router.navigate(['/pages/modelo-contratos'])
    },
    error: (error) => {
      console.error(error);
      this.toastrService.error(error.error.errors[0], '', { progressBar: true });
    }
  });
}


  backContact() {
    this.router.navigate(['/pages/modelo-contratos'])
  }

}

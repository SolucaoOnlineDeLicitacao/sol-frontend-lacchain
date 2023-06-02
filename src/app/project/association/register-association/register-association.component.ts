import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationService } from 'src/services/association.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register-association',
  templateUrl: './register-association.component.html',
  styleUrls: ['./register-association.component.scss']
})
export class RegisterAssociationComponent implements OnInit {

  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  isSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router
  ) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
    });

    this.formAddress = this.formBuilder.group({
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      number: ['', [Validators.required]],
      publicPlace: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
    });

    this.formLegalRepresentative = this.formBuilder.group({
      name: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      rg: ['', [Validators.required]],
      validityData: ['', [Validators.required]]
    });

    this.formLegalRepresentativeAddress = this.formBuilder.group({
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      number: ['', [Validators.required]],
      publicPlace: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
    });
  }


  ngOnInit(): void {
  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID' || this.formAddress.status == 'INVALID' || this.formLegalRepresentative.status == 'INVALID' ||
      this.formLegalRepresentativeAddress.status == 'INVALID') {
      return;
    }

    let dto = {
      ...this.form.value,
      address: { ...this.formAddress.value },
      legalRepresentative: { ...this.formLegalRepresentative.value, address: { ...this.formLegalRepresentativeAddress.value } },
    }

    this.ngxSpinnerService.show();
    this.associationService.register(dto).subscribe({
      next: (success) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Associação cadastrada com sucesso!', '', { progressBar: true});
        this.router.navigate(['/pages/associacao'])
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error( error.error.errors[0], '', { progressBar: true});
        this.ngxSpinnerService.hide();
      }
    });

  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationService } from 'src/services/association.service';

@Component({
  selector: 'app-update-association',
  templateUrl: './update-association.component.html',
  styleUrls: ['./update-association.component.scss']
})
export class UpdateAssociationComponent implements OnInit {

  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  isSubmit: boolean = false;
  associationId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.associationService.getById(params['id']).subscribe({
        next: (success) => {
          this.associationId = success._id;

          this.form.patchValue({
            name: success.name,
            cnpj: success.cnpj
          });

          this.formAddress.patchValue({
            zipCode: success.address.zipCode,
            number: success.address.number,
            publicPlace: success.address.publicPlace,
            neighborhood: success.address.neighborhood,
            city: success.address.city,
            state: success.address.state,
            latitude: success.address.latitude,
            longitude: success.address.longitude,
            complement: success.address.complement,
            referencePoint: success.address.referencePoint
          });

          this.formLegalRepresentative.patchValue({
            name: success.legalRepresentative.name,
            nationality: success.legalRepresentative.nationality,
            maritalStatus: success.legalRepresentative.maritalStatus,
            cpf: success.legalRepresentative.cpf,
            rg: success.legalRepresentative.rg,
            validityData: success.legalRepresentative.validityData.toString().slice(0,10)
          });

          this.formLegalRepresentativeAddress.patchValue({
            zipCode: success.legalRepresentative.address.zipCode,
            number: success.legalRepresentative.address.number,
            publicPlace: success.legalRepresentative.address.publicPlace,
            neighborhood: success.legalRepresentative.address.neighborhood,
            city: success.legalRepresentative.address.city,
            state: success.legalRepresentative.address.state,
            latitude: success.legalRepresentative.address.latitude,
            longitude: success.legalRepresentative.address.longitude,
            complement: success.legalRepresentative.address.complement,
            referencePoint: success.legalRepresentative.address.referencePoint
          });

          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-admin']);
          this.ngxSpinnerService.hide();
        }
      });
    });


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
    this.associationService.update(this.associationId, dto).subscribe({
      next: (success) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Associação editada com sucesso!', '', { progressBar: true});
        this.router.navigate(['/pages/associacao']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error( error.error.errors[0], '', { progressBar: true});
        this.ngxSpinnerService.hide();
      }
    });

  }

}

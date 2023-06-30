import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationService } from 'src/services/association.service';
import { CepService } from '../../../../services/cep.service';
import { CepResponseDto } from '../../../../dtos/address/cep-response.dto';
import { NominatimService } from '../../../../services/nominatim.service';

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
  regex =  /\b(\d)\1+\b/

  storedLanguage : string | null

  @ViewChild('addressnumber') inputNumber: ElementRef;
  @ViewChild('addressnumberlegal') inputNumberLegalRepresentative: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private cepService: CepService,
    private nominatimService: NominatimService,
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
      complement: [''],
      referencePoint: [''],
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
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

        let successMessage = 'Associação cadastrada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Associação cadastrada com sucesso!'
            break;
          case 'en':
            successMessage = 'Association successfully registered!'
            break;
          case 'fr':
            successMessage = 'Association enregistrée avec succès!'
            break;
          case 'es':
            successMessage = '¡Asociación registrada con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/associacao'])
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
        this.ngxSpinnerService.hide();
      }
    });

  }

  async searchAssociationAddressByCep(event: any) {

    if (event.target.value) {

      let cep: string = event.target.value.replace('.', '');
      cep = cep.replace('-', '');

      if (cep.length === 8) {

        const response = await this.searchCep(cep);

        this.formAddress.patchValue({
          publicPlace: response.logradouro,
          neighborhood: response.bairro,
          city: response.cidade,
          state: response.uf,
        });

        this.inputNumber.nativeElement.focus();
      }
    }
  }

  async searchLegalRepresentativeAddressByCep(event: any) {

    if (event.target.value) {

      let cep: string = event.target.value.replace('.', '');
      cep = cep.replace('-', '');

      if (cep.length === 8) {

        const response = await this.searchCep(cep);

        this.formLegalRepresentativeAddress.patchValue({
          publicPlace: response.logradouro,
          neighborhood: response.bairro,
          city: response.cidade,
          state: response.uf,
        });

        this.inputNumberLegalRepresentative.nativeElement.focus();
      }
    }
  }

  async searchCep(cep: string): Promise<CepResponseDto> {
    return await this.cepService.buscarCep(cep);
  }

  async getLatLong(event: any) {

    const address = { ...this.formAddress.value };

    const result: any = await this.nominatimService.getLatLongByAddress(
      address.publicPlace,
      address.city,
      'brazil',
      address.state,
    );

    if (result && result.length > 0) {

      const lat = result[0].lat;
      const lng = result[0].lon;

      this.formAddress.patchValue({
        latitude: lat,
        longitude: lng,
      });
    }
  }
}

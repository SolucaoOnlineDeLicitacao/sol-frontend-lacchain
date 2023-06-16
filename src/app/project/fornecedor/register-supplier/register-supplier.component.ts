import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CepResponseDto } from "../../../../dtos/address/cep-response.dto";
import { CepService } from "../../../../services/cep.service";
import { NominatimService } from "../../../../services/nominatim.service";
import { SupplierRegisterDto } from "../../../../dtos/supplier/supplier-register-request.dto";
import { AddressDto } from "../../../../dtos/shared/address.dto";
import { LegalRepresentativeDto } from "../../../../dtos/shared/legal.representative.dto";
import { SupplierService } from "../../../../services/supplier.service";
import { CategoryService } from "../../../../services/category.service";
import { CategoryResponseDto } from "../../../../dtos/category/category-response.dto";


@Component({
  selector: 'app-register-supplier',
  templateUrl: './register-supplier.component.html',
  styleUrls: ['./register-supplier.component.scss']
})
export class RegisterSupplierComponent implements OnInit {

  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  formCategoryAndSegments!: FormGroup;
  isSubmit: boolean = false;
  categoriesAndSegments: CategoryResponseDto[] = [];
  selectCategoriesAndSegments: CategoryResponseDto[] = [];

  @ViewChild('addressnumber') inputNumber: ElementRef;
  @ViewChild('addressnumberlegal') inputNumberLegalRepresentative: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private cepService: CepService,
    private nominatimService: NominatimService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
  ) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      cnpj: ['', [Validators.minLength(14)]],
      cpf: ['', [Validators.minLength(13)]],
      type: ['', [Validators.required]]
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

    this.formCategoryAndSegments = this.formBuilder.group({
      categories: ['']
    });
  }


  ngOnInit(): void {
    this.categoryService.getCategory().subscribe((response) => {
      this.categoriesAndSegments = response;
    })
  }

  onSubmit() {

    console.log('onSubmit')

    this.isSubmit = true;
    if (this.formAddress.status == 'INVALID' || this.formLegalRepresentative.status == 'INVALID' ||
      this.formLegalRepresentativeAddress.status == 'INVALID') {
      return;
    }

    const document = this.form.controls['cnpj'].value ? this.form.controls['cnpj'].value : this.form.controls['cpf'].value;

    const newSupplier: SupplierRegisterDto = {
      name: this.form.controls['name'].value,
      cpf: document,
      type: this.form.controls['type'].value === 'cpf' ? 'pessoa_fisica' : 'pessoa_juridica',
      group_id: this.formCategoryAndSegments.controls['categories'].value,
      address: new AddressDto(),
      legal_representative: new LegalRepresentativeDto(),
      categoriesId: this.selectCategoriesAndSegments?.map((category) => category._id || '') || [],
    };  

    newSupplier.address.city = this.formAddress.controls['city'].value;
    newSupplier.address.complement = this.formAddress.controls['complement'].value;
    newSupplier.address.latitude = this.formAddress.controls['latitude'].value;
    newSupplier.address.longitude = this.formAddress.controls['longitude'].value;
    newSupplier.address.neighborhood = this.formAddress.controls['neighborhood'].value;
    newSupplier.address.number = this.formAddress.controls['number'].value;
    newSupplier.address.publicPlace = this.formAddress.controls['publicPlace'].value;
    newSupplier.address.referencePoint = this.formAddress.controls['referencePoint'].value;
    newSupplier.address.state = this.formAddress.controls['state'].value;
    newSupplier.address.zipCode = this.formAddress.controls['zipCode'].value;

    newSupplier.legal_representative.name = this.formLegalRepresentative.controls['name'].value;
    newSupplier.legal_representative.nationality = this.formLegalRepresentative.controls['nationality'].value;
    newSupplier.legal_representative.maritalStatus = this.formLegalRepresentative.controls['maritalStatus'].value;
    newSupplier.legal_representative.cpf = this.formLegalRepresentative.controls['cpf'].value;
    newSupplier.legal_representative.rg = this.formLegalRepresentative.controls['rg'].value;
    newSupplier.legal_representative.validityData = this.formLegalRepresentative.controls['validityData'].value;

    newSupplier.legal_representative.address = new AddressDto();
    newSupplier.legal_representative.address.complement = this.formLegalRepresentativeAddress.controls['complement'].value;
    newSupplier.legal_representative.address.city = this.formLegalRepresentativeAddress.controls['city'].value;
    newSupplier.legal_representative.address.neighborhood = this.formLegalRepresentativeAddress.controls['neighborhood'].value;
    newSupplier.legal_representative.address.number = this.formLegalRepresentativeAddress.controls['number'].value;
    newSupplier.legal_representative.address.publicPlace = this.formLegalRepresentativeAddress.controls['publicPlace'].value;
    newSupplier.legal_representative.address.referencePoint = this.formLegalRepresentativeAddress.controls['referencePoint'].value;
    newSupplier.legal_representative.address.state = this.formLegalRepresentativeAddress.controls['state'].value;
    newSupplier.legal_representative.address.zipCode = this.formLegalRepresentativeAddress.controls['zipCode'].value;

    this.supplierService.register(newSupplier).subscribe({
      next:success => {
        this.toastrService.success('Fornecedor criado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/fornecedor']);
      },
      error:error => {
        this.toastrService.error('Erro ao cadastrar o fornecedor!', '', { progressBar: true });
      },}
    );
  }

  handleCategories() {

    if (this.formCategoryAndSegments.controls['categories'].value) {
      const selected = this.categoriesAndSegments.find(a => a._id?.toString() === this.formCategoryAndSegments.controls['categories'].value)
      this.selectCategoriesAndSegments.push(selected!);
    }
  }

  removeCategory(index: number) {
    this.selectCategoriesAndSegments.splice(index, 1);
  }

  async searchSupplierAddressByCep(event: any) {

    if (event.target.value) {

      let cep: string = event.target.value.replace('.', '');
      cep = cep.replace('-', '');

      if (cep.length === 8) {
        const response = await this.cepService.buscarCep(cep);
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

    const result: any = await this.nominatimService.getLatLongByAddressq(address.zipCode);

    let lat = 1;
    let lng = 1;

    if (result.length > 0) {

      lat = result[0].lat;
      lng = result[0].lon;
    }

    this.formAddress.patchValue({
      latitude: lat,
      longitude: lng,
    });
  }
}

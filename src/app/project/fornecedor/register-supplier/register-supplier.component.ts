import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AssociationService } from "src/services/association.service";
import { AllSuppliers, supplierList } from "src/services/supplier.mock";


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
  categoriesAndSegments: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router
  ) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      cpf: ['', [Validators.required, Validators.minLength(13)]],
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
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
    });

    this.formCategoryAndSegments = this.formBuilder.group({
      categories: ['']
    });
  }


  ngOnInit(): void {
  }

  generateRandomId() {
    const min = 1;
    const max = 100000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onSubmit() {

    this.isSubmit = true;
    if (this.formAddress.status == 'INVALID' || this.formLegalRepresentative.status == 'INVALID' ||
      this.formLegalRepresentativeAddress.status == 'INVALID') {
      return;
    }

    if (this.form.controls['type'].value == 'cnpj') {
      const newSupplier: AllSuppliers = {
        _id: this.generateRandomId(),
        name: this.form.controls['name'].value,
        document: this.form.controls['cnpj'].value,
        county: this.formAddress.controls['city'].value,
        block: false,
        zip: this.formAddress.controls['zipCode'].value,
        number: this.formAddress.controls['number'].value,
        publicPlace: this.formAddress.controls['publicPlace'].value,
        neighborhood: this.formAddress.controls['neighborhood'].value,
        city: this.formAddress.controls['city'].value,
        state: this.formAddress.controls['state'].value,
        latitude: this.formAddress.controls['latitude'].value,
        longitude: this.formAddress.controls['longitude'].value,
        complement: this.formAddress.controls['complement'].value,
        referencePoint: this.formAddress.controls['referencePoint'].value,
        legalName: this.formLegalRepresentative.controls['name'].value,
        nationality: this.formLegalRepresentative.controls['nationality'].value,
        maritalStatus: this.formLegalRepresentative.controls['name'].value,
        cpf: this.formLegalRepresentative.controls['name'].value,
        rg: this.formLegalRepresentative.controls['name'].value,
        validityData: this.formLegalRepresentative.controls['name'].value,
        legalZip: this.formLegalRepresentativeAddress.controls['zipCode'].value,
        legalNumber: this.formLegalRepresentativeAddress.controls['number'].value,
        legalPublicPlace: this.formLegalRepresentativeAddress.controls['publicPlace'].value,
        legalNeighborhood: this.formLegalRepresentativeAddress.controls['neighborhood'].value,
        legalCity: this.formLegalRepresentativeAddress.controls['city'].value,
        legalState: this.formLegalRepresentativeAddress.controls['state'].value,
        legalLatitude: this.formLegalRepresentativeAddress.controls['latitude'].value,
        legalLongitude: this.formLegalRepresentativeAddress.controls['longitude'].value,
        legalComplement: this.formLegalRepresentativeAddress.controls['complement'].value,
        legalReferencePoint: this.formLegalRepresentativeAddress.controls['referencePoint'].value,
        categories: this.categoriesAndSegments,
      };
      supplierList.push(newSupplier);
    }

    if (this.form.controls['type'].value == 'cpf') {
      const newSupplier: AllSuppliers = {
        _id: this.generateRandomId(),
        name: this.form.controls['name'].value,
        document: this.form.controls['cpf'].value,
        county: this.formAddress.controls['city'].value,
        block: false,
        zip: this.formAddress.controls['zipCode'].value,
        number: this.formAddress.controls['number'].value,
        publicPlace: this.formAddress.controls['publicPlace'].value,
        neighborhood: this.formAddress.controls['neighborhood'].value,
        city: this.formAddress.controls['city'].value,
        state: this.formAddress.controls['state'].value,
        latitude: this.formAddress.controls['latitude'].value,
        longitude: this.formAddress.controls['longitude'].value,
        complement: this.formAddress.controls['complement'].value,
        referencePoint: this.formAddress.controls['referencePoint'].value,
        legalName: this.formLegalRepresentative.controls['name'].value,
        nationality: this.formLegalRepresentative.controls['nationality'].value,
        maritalStatus: this.formLegalRepresentative.controls['name'].value,
        cpf: this.formLegalRepresentative.controls['name'].value,
        rg: this.formLegalRepresentative.controls['name'].value,
        validityData: this.formLegalRepresentative.controls['name'].value,
        legalZip: this.formLegalRepresentativeAddress.controls['zipCode'].value,
        legalNumber: this.formLegalRepresentativeAddress.controls['number'].value,
        legalPublicPlace: this.formLegalRepresentativeAddress.controls['publicPlace'].value,
        legalNeighborhood: this.formLegalRepresentativeAddress.controls['neighborhood'].value,
        legalCity: this.formLegalRepresentativeAddress.controls['city'].value,
        legalState: this.formLegalRepresentativeAddress.controls['state'].value,
        legalLatitude: this.formLegalRepresentativeAddress.controls['latitude'].value,
        legalLongitude: this.formLegalRepresentativeAddress.controls['longitude'].value,
        legalComplement: this.formLegalRepresentativeAddress.controls['complement'].value,
        legalReferencePoint: this.formLegalRepresentativeAddress.controls['referencePoint'].value,
        categories: this.categoriesAndSegments,
      };
      supplierList.push(newSupplier);
    }

    this.toastrService.success('Fornecedor criado com sucesso!', '', { progressBar: true });
    this.router.navigate(['/pages/fornecedor']);

  }

  handleCategories() {
    if (this.formCategoryAndSegments.controls['categories'].value) {
      this.categoriesAndSegments.push(this.formCategoryAndSegments.controls['categories'].value);
    }
  }

  removeCategory(index: number) {
    this.categoriesAndSegments.splice(index, 1);
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationService } from 'src/services/association.service';
import { AllSuppliers, supplierList } from 'src/services/supplier.mock';

@Component({
  selector: 'app-update-fornecedor',
  templateUrl: './update-fornecedor.component.html',
  styleUrls: ['./update-fornecedor.component.scss']
})
export class UpdateFornecedorComponent {

  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  isSubmit: boolean = false;
  associationId!: string;
  fornecedor!: AllSuppliers | undefined;
  formCategoryAndSegments!: FormGroup;
  categoriesAndSegments: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
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

    this.formCategoryAndSegments = this.formBuilder.group({
      categories: ['']
    });
  }

  ngOnInit(): void {

    const fornecedorId = Number(this.route.snapshot.paramMap.get('id'));
    this.fornecedor = supplierList.find(fornecedor => fornecedor._id === fornecedorId);

    this.form.patchValue({
      name: this.fornecedor?.name,
      cnpj: this.fornecedor?.document
    });

    this.formAddress.patchValue({
      zipCode: this.fornecedor?.zip,
      number: this.fornecedor?.number,
      publicPlace: this.fornecedor?.publicPlace,
      neighborhood: this.fornecedor?.neighborhood,
      city: this.fornecedor?.city,
      state: this.fornecedor?.state,
      latitude: this.fornecedor?.latitude,
      longitude: this.fornecedor?.longitude,
      complement: this.fornecedor?.complement,
      referencePoint: this.fornecedor?.referencePoint
    });

    this.formLegalRepresentative.patchValue({
      name: this.fornecedor?.legalName,
    });

    this.formLegalRepresentativeAddress.patchValue({
      zipCode: this.fornecedor?.legalZip,
      number: this.fornecedor?.legalNumber,
      publicPlace: this.fornecedor?.legalPublicPlace,
      neighborhood: this.fornecedor?.legalNeighborhood,
      city: this.fornecedor?.legalCity,
      state: this.fornecedor?.legalState,
      latitude: this.fornecedor?.legalLatitude,
      longitude: this.fornecedor?.legalLongitude,
      complement: this.fornecedor?.legalComplement,
      referencePoint: this.fornecedor?.legalReferencePoint
    });
  }

  salvarEdicao() {
    this.fornecedor!.name = this.form.value.name;
    this.fornecedor!.document = this.form.value.cnpj;
    this.fornecedor!.zip = this.formAddress.value.zipCode;
    this.fornecedor!.number = this.formAddress.value.number;
    this.fornecedor!.publicPlace = this.formAddress.value.publicPlace;
    this.fornecedor!.neighborhood = this.formAddress.value.neighborhood;
    this.fornecedor!.city = this.formAddress.value.city;
    this.fornecedor!.state = this.formAddress.value.state;
    this.fornecedor!.latitude = this.formAddress.value.latitude;
    this.fornecedor!.longitude = this.formAddress.value.longitude;
    this.fornecedor!.complement = this.formAddress.value.complement;
    this.fornecedor!.referencePoint = this.formAddress.value.referencePoint;
    this.fornecedor!.legalZip = this.formLegalRepresentativeAddress.value.zipCode;
    this.fornecedor!.legalNumber = this.formLegalRepresentativeAddress.value.number;
    this.fornecedor!.legalPublicPlace = this.formLegalRepresentativeAddress.value.publicPlace;
    this.fornecedor!.legalNeighborhood = this.formLegalRepresentativeAddress.value.neighborhood;
    this.fornecedor!.legalCity = this.formLegalRepresentativeAddress.value.city;
    this.fornecedor!.legalState = this.formLegalRepresentativeAddress.value.state;
    this.fornecedor!.legalLatitude = this.formLegalRepresentativeAddress.value.latitude;
    this.fornecedor!.legalLongitude = this.formLegalRepresentativeAddress.value.longitude;
    this.fornecedor!.legalComplement = this.formLegalRepresentativeAddress.value.complement;
    this.fornecedor!.legalReferencePoint = this.formLegalRepresentativeAddress.value.referencePoint;

    this.toastrService.success('Fornecedor editado com sucesso!', '', { progressBar: true });
    this.router.navigate(['/pages/fornecedor']);

  }

  onSubmit() {
    this.salvarEdicao();
  }

  handleCategories() {
    if (this.formCategoryAndSegments.controls['categories'].value) {
      this.fornecedor?.categories.push(this.formCategoryAndSegments.controls['categories'].value);
    }
  }

  removeCategory(index: number) {
    this.fornecedor?.categories.splice(index, 1);
  }

}

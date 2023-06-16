import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { SupplierRegisterDto } from 'src/dtos/supplier/supplier-register-request.dto';
import { CategoryService } from 'src/services/category.service';
import { SupplierService } from 'src/services/supplier.service';

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
  fornecedor!: any | undefined;
  formCategoryAndSegments!: FormGroup;
  categoriesAndSegments: any[] = [];
  selectCategoriesAndSegments: CategoryResponseDto[] = [];

  request:SupplierRegisterDto;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private supplierService:SupplierService,
    private categoryService: CategoryService,
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
    
    const fornecedorId = this.route.snapshot.paramMap.get('id');
    if(fornecedorId) {
      this.supplierService.getById(fornecedorId).subscribe({
        next: (fornecedor:any) => {
          this.fornecedor = fornecedor;
          this.handlerInitForm()
          this.categoryService.getCategory().subscribe((response) => {
            this.categoriesAndSegments = response;
            this.selectCategoriesAndSegments = this.categoriesAndSegments.filter((category) => {
              return fornecedor.categories.some((categoryFornecedor:any) => {
                return categoryFornecedor.id === category.id;
              });
            });
          })
        },
        error: (error) => {
          this.toastrService.error(error.error);
        }
      })
    }
  }

  handlerInitForm(){
    this.form.patchValue({
      name: this.fornecedor?.name,
      cnpj: this.fornecedor?.cpf
    });

    this.formAddress.patchValue({
      zipCode: this.fornecedor?.address?.zipCode,
      number: this.fornecedor?.address?.number,
      publicPlace: this.fornecedor?.address?.publicPlace,
      neighborhood: this.fornecedor?.address?.neighborhood,
      city: this.fornecedor?.address?.city,
      state: this.fornecedor?.address?.state,
      latitude: this.fornecedor?.address?.latitude,
      longitude: this.fornecedor?.address?.longitude,
      complement: this.fornecedor?.address?.complement,
      referencePoint: this.fornecedor?.address?.referencePoint
    });

    this.formLegalRepresentative.patchValue({
      name: this.fornecedor?.legal_representative?.name,
      nationality: this.fornecedor?.legal_representative?.nationality,
      maritalStatus: this.fornecedor?.legal_representative?.maritalStatus,
      cpf: this.fornecedor?.legal_representative?.cpf,
      rg: this.fornecedor?.legal_representative?.rg,
      validityData: this.fornecedor?.legal_representative?.validityData
    });

    this.formLegalRepresentativeAddress.patchValue({
      zipCode: this.fornecedor?.legal_representative?.address?.zipCode,
      number: this.fornecedor?.legal_representative?.address?.number,
      publicPlace: this.fornecedor?.legal_representative?.address?.publicPlace,
      neighborhood: this.fornecedor?.legal_representative?.address?.neighborhood,
      city: this.fornecedor?.legal_representative?.address?.city,
      state: this.fornecedor?.legal_representative?.address?.state,
      latitude: this.fornecedor?.legal_representative?.address?.latitude,
      longitude: this.fornecedor?.legal_representative?.address?.longitude,
      complement: this.fornecedor?.legal_representative?.address?.complement,
      referencePoint: this.fornecedor?.legal_representative?.address?.referencePoint
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

    const categoriesId = [...this.selectCategoriesAndSegments?.map((category) => category._id), ...this.fornecedor?.categories?.map((category:any) => category._id)]

    this.request = {
      name: this.form.value.name,
      cpf: this.form.value.cnpj,
      address: {
        zipCode: this.formAddress.value.zipCode,
        number: this.formAddress.value.number,
        publicPlace: this.formAddress.value.publicPlace,
        neighborhood: this.formAddress.value.neighborhood,
        city: this.formAddress.value.city,
        state: this.formAddress.value.state,
        latitude: this.formAddress.value.latitude,
        longitude: this.formAddress.value.longitude,
        complement: this.formAddress.value.complement,
        referencePoint: this.formAddress.value.referencePoint
      },
      legal_representative:{
        name: this.formLegalRepresentative.value.name,
        cpf: this.formLegalRepresentative.value.cpf,
        address: {
          zipCode: this.formLegalRepresentativeAddress.value.zipCode,
          number: this.formLegalRepresentativeAddress.value.number,
          publicPlace: this.formLegalRepresentativeAddress.value.publicPlace,
          neighborhood: this.formLegalRepresentativeAddress.value.neighborhood,
          city: this.formLegalRepresentativeAddress.value.city,
          state: this.formLegalRepresentativeAddress.value.state,
          latitude: this.formLegalRepresentativeAddress.value.latitude,
          longitude: this.formLegalRepresentativeAddress.value.longitude,
          complement: this.formLegalRepresentativeAddress.value.complement,
          referencePoint: this.formLegalRepresentativeAddress.value.referencePoint
        },
        maritalStatus: this.formLegalRepresentative.value.maritalStatus,
        validityData: this.formLegalRepresentative.value.validityData,
        rg: this.formLegalRepresentative.value.rg,
        nationality:this.formLegalRepresentative.value.nationality

      },
      group_id: this.fornecedor?.group_id,
      type:this.fornecedor?.type,
      categoriesId: categoriesId || [],
    };

    console.log(this.request.categoriesId);

    this.supplierService.update(this.fornecedor?._id!, this.request).subscribe({
      next: (response) => {
        this.toastrService.success('Fornecedor editado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/fornecedor']);
      },
      error: (error) => {
        console.log(error);
        this.toastrService.error('Erro ao editar fornecedor', '', { progressBar: true });
      }
    })


  }

  onSubmit() {
    this.salvarEdicao();
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

}

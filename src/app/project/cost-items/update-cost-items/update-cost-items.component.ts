import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { CostItemsRegisterDto } from 'src/dtos/cost-items/cost-items-register.dto';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { ProductResponseDto } from 'src/dtos/product/product.response.dto';
import { CategoryService } from 'src/services/category.service';
import { CostItemsService } from 'src/services/cost-items.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-update-cost-items',
  templateUrl: './update-cost-items.component.html',
  styleUrls: ['./update-cost-items.component.scss']
})
export class UpdateCostItemsComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  request: CostItemsRegisterDto;
  categoryList: CategoryResponseDto[];
  productList: ProductResponseDto[];

  response: CostItemsResponseDto;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private costItemsService: CostItemsService,
    public localStorage: LocalStorageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      unitMeasure: ['', [Validators.required]],
      category: ['', [Validators.required]],
      product: ['', [Validators.required]],
      specification: ['', [Validators.required]],
      sustainable: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.route.data.subscribe({
      next: (data) => {
        this.response = data["costItem"];
        this.form.patchValue({
          code: this.response.code,
          name: this.response.name,
          unitMeasure: this.response.unitMeasure,
          category: this.response.category._id,
          product: this.response.product._id,
          specification: this.response.specification,
          sustainable: this.response.sustainable,
        });
        this.ngxSpinnerService.hide();
      }
    })

    this.getProduct();
    this.getCategory();
  }

  getCategory() {
    this.categoryService.getCategory().subscribe({
      next: (success) => {
        this.categoryList = success
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  getProduct() {
    this.productService.getProduct().subscribe({
      next: (success) => {
        this.productList = success
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  onSubmit() {
    if (this.form.controls['sustainable'].value === '') this.form.controls['sustainable'].setValue(false)
    this.request = {
      code: this.form.controls['code'].value,
      name: this.form.controls['name'].value,
      unitMeasure: this.form.controls['unitMeasure'].value,
      categoryId: this.form.controls['category'].value,
      productId: this.form.controls['product'].value,
      specification: this.form.controls['specification'].value,
      sustainable: this.form.controls['sustainable'].value,
    }
    this.costItemsService.update(this.localStorage.getDataCostItems()._id, this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Item editado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/itens-custo']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], 'Erro ao editadar o item', { progressBar: true });
      }
    });
  }
}

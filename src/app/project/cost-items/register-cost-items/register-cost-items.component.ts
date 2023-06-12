import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { CostItemsRegisterDto } from 'src/dtos/cost-items/cost-items-register.dto';
import { ProductResponseDto } from 'src/dtos/product/product.response.dto';
import { CategoryService } from 'src/services/category.service';
import { CostItemsService } from 'src/services/cost-items.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-register-cost-items',
  templateUrl: './register-cost-items.component.html',
  styleUrls: ['./register-cost-items.component.scss']
})
export class RegisterCostItemsComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: CostItemsRegisterDto;
  categoryList: CategoryResponseDto[];
  productList: ProductResponseDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private costItemsService: CostItemsService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastrService: ToastrService,
    private router: Router
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
        this.productList = success;
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    if (this.form.controls['sustainable'].value === '') this.form.controls['sustainable'].setValue(false)
    this.request = {
      code: this.form.controls['code'].value,
      name: this.form.controls['name'].value,
      unitMeasure: this.form.controls['unitMeasure'].value,
      categoryId: this.form.controls['category'].value,
      productId: this.form.controls['product'].value,
      product_relation: 'string',
      specification: this.form.controls['specification'].value,
      sustainable: this.form.controls['sustainable'].value,
    }
    this.costItemsService.register(this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Item cadastrado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/itens-custo']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });

  }

}

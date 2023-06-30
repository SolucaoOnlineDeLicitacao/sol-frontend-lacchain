import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { CostItemsRegisterDto } from 'src/dtos/cost-items/cost-items-register.dto';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto,';
import { ProductResponseDto } from 'src/dtos/product/product.response.dto';
import { CategoryService } from 'src/services/category.service';
import { CostItemsService } from 'src/services/cost-items.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-new-produto',
  templateUrl: './new-produto.component.html',
  styleUrls: ['./new-produto.component.scss']
})
export class NewProdutoComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: ProductRequestDto;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private productService: ProductService,
    private translate: TranslateService,

    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }


  ngOnInit(): void {
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    this.request = {
      product_name: this.form.controls['name'].value,
    }
    this.productService.register(this.request).subscribe({
      next: (success) => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DELETE_USER'), '', { progressBar: true });
        this.router.navigate(['/pages/produtos']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.success(error.error.errors[0],this.translate.instant('TOASTRS.ERROR_CREATE_PRODUCT'),{ progressBar: true });
      }
    });
  }

}


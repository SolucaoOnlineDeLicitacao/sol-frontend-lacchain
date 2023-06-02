import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryRequestDto } from 'src/dtos/category/category-request.dto';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto,';
import { CategoryService } from 'src/services/category.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-new-categorias',
  templateUrl: './new-categorias.component.html',
  styleUrls: ['./new-categorias.component.scss']
})
export class NewCategoriasComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: CategoryRequestDto;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      category: ['', [Validators.required, Validators.maxLength(50)]],
      segment: ['', [Validators.required]],
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
      category_name: this.form.controls['category'].value,
      segment: this.form.controls['segment'].value,
      identifier: 0,
    }
    this.categoryService.register(this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Categoria cadastrada com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/categorias']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Error ao cadastrar a categoria!', '', { progressBar: true });
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

}


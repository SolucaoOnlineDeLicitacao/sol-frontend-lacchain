import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryRequestDto } from 'src/dtos/category/category-request.dto';
import { CategoryService } from 'src/services/category.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-edit-categorias',
  templateUrl: './edit-categorias.component.html',
  styleUrls: ['./edit-categorias.component.scss']
})
export class EditCategoriasComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: CategoryRequestDto;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      category: ['', [Validators.required, Validators.maxLength(50)]],
      segment: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.form.patchValue({
      category: this.localStorage.getDataCategoria().category_name,
      segment: this.localStorage.getDataCategoria().segment,
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    this.request = {
      category_name: this.form.controls['category'].value,
      segment: this.form.controls['segment'].value,
      identifier: this.localStorage.getDataCategoria().identifier,
    }
    this.categoryService.update(this.localStorage.getDataCategoria()._id, this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Categoria editada com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/categorias']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Error ao editar a categoria!', '', { progressBar: true });
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

}


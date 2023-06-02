import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-user-fornecedor',
  templateUrl: './update-user-fornecedor.component.html',
  styleUrls: ['./update-user-fornecedor.component.scss']
})
export class UpdateUserFornecedorComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  userId!: string;

  supplierList = [
    { id: 1, name: 'Fornecedor 1' },
    { id: 2, name: 'Fornecedor 2' },
    { id: 3, name: 'Fornecedor 3' },
    { id: 4, name: 'Fornecedor 4' },
    { id: 5, name: 'Fornecedor 5' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['fornecedor', [Validators.required]],
      supplier: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      document: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.userId = success._id;
          this.form.patchValue({
            name: success.name,
            email: success.email,
            supplier: success.supplier,
            phone: success.phone,
            document: success.document
          });

          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-fornecedor']);
          this.ngxSpinnerService.hide();
        }
      });
    });

  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }

    this.userService.updateById(this.userId, this.form.value).subscribe({
      next: (success) => {
        this.toastrService.success('Usuário editado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/controle-fornecedor']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });

  }

}
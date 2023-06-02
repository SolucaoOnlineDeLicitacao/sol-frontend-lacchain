import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register-user-fornecedor',
  templateUrl: './register-user-fornecedor.component.html',
  styleUrls: ['./register-user-fornecedor.component.scss']
})
export class RegisterUserFornecedorComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;

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
    private router: Router
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

  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }

    this.userService.register(this.form.value).subscribe({
      next: (success) => {
        this.toastrService.success('Usuário cadastrado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/controle-fornecedor']);
      },
      error: (error) => {
        console.error(error);

        if (error.error.errors[0].includes('duplicate key')) {
          if (error.error.errors[0].includes('email')) {
            this.toastrService.error('Esse email ja foi cadastrado!', '', { progressBar: true });
          } else if (error.error.errors[0].includes('phone')) {
            this.toastrService.error('Esse telefone ja foi cadastrado!', '', { progressBar: true });
          } else if (error.error.errors[0].includes('cpf')) {
            this.toastrService.error('Esse CPF/CNPJ ja foi cadastrado!', '', { progressBar: true });
          }
        } else {
          this.toastrService.error(error.error.errors[0], '', { progressBar: true });
        }


      }
    });

  }

}
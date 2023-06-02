import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user-administracao',
  templateUrl: './register-user-administracao.component.html',
  styleUrls: ['./register-user-administracao.component.scss']
})
export class RegisterUserAdministracaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;

  rolesList = [
    { value: 'geral', name: 'Administrador Geral' },
    { value: 'revisor', name: 'Revisor' },
    { value: 'visualizador', name: 'Visualizador' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [ Validators.required, Validators.maxLength(50) ]],
      email: ['', [ Validators.required, Validators.email ]],
      type: ['administrador', [ Validators.required ]],
      roles: [null, [ Validators.required ]]
    });
  }


  ngOnInit(): void {
  }

  onSubmit() {
    this.isSubmit = true;
    if(this.form.status == 'INVALID') {
      return;
    }

    this.userService.register(this.form.value).subscribe({
      next: (success) => {
        this.toastrService.success('Usuário cadastrado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/controle-admin']);
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

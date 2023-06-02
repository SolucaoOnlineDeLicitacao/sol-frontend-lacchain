import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register-user-associacao',
  templateUrl: './register-user-associacao.component.html',
  styleUrls: ['./register-user-associacao.component.scss']
})
export class RegisterUserAssociacaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  associationList!: AssociationResponseDto[];

 
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private associationService: AssociationService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['associacao', [Validators.required]],
      office: [ null, [Validators.required]],
      association: [ null, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      document: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.associationService.list().subscribe({
      next: (success) => {
        this.associationList = success;
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        console.error(error);
        this.ngxSpinnerService.hide();
      }
    });

  }

  onSubmit() {
    
    this.isSubmit = true;
    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }

    this.ngxSpinnerService.show();
    this.userService.register(this.form.value).subscribe({
      next: (success) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Usuário cadastrado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/controle-associacao']);
      },
      error: (error) => {
        console.error(error);
        this.ngxSpinnerService.hide();
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
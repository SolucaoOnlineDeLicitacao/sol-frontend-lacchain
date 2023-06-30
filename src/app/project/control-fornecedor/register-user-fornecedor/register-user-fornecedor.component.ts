import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { SupplierService } from 'src/services/supplier.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register-user-fornecedor',
  templateUrl: './register-user-fornecedor.component.html',
  styleUrls: ['./register-user-fornecedor.component.scss']
})
export class RegisterUserFornecedorComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;

  supplierList: any = [];
  regex =  /\b(\d)\1+\b/

  storedLanguage : string | null

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private supplierService: SupplierService,
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
    this.supplierService.supplierList().subscribe({
      next: (success) => {
        this.supplierList = success;
      },
      error: (error) => {
        console.error(error.error.errors[0]);
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }


  onSubmit() {

    this.isSubmit = true;

    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }



    this.userService.register(this.form.value).subscribe({
      next: (success) => {

        let successMessage = 'Usuário cadastrado com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Usuário cadastrado com sucesso!'
            break;
          case 'en':
            successMessage = 'User successfully registered!'
            break;
          case 'fr':
            successMessage = 'Utilisateur enregistré avec succès !'
            break;
          case 'es':
            successMessage = '¡Usuario registrado con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/controle-fornecedor']);
      },
      error: (error) => {

        let errorEmail = 'Esse email ja foi cadastrado!';
        let errorPhone = 'Esse telefone ja foi cadastrado!';
        let errorCPFCNPJ = 'Esse CPF/CNPJ ja foi cadastrado!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorEmail = 'Esse email ja foi cadastrado!';
            errorPhone = 'Esse telefone ja foi cadastrado!';
            errorCPFCNPJ = 'Esse CPF/CNPJ ja foi cadastrado!';
            break;
          case 'en':
            errorEmail = 'This email has already been registered!';
            errorPhone = 'This phone has already been registered!';
            errorCPFCNPJ = 'This CPF/CNPJ has already been registered!';
            break;
          case 'fr':
            errorEmail = 'Cet e-mail a déjà été enregistré !';
            errorPhone = 'Ce téléphone a déjà été enregistré !';
            errorCPFCNPJ = 'Ce CPF/CNPJ est déjà inscrit !';
            break;
          case 'es':
            errorEmail = '¡Este correo electrónico ya ha sido registrado!';
            errorPhone = '¡Este teléfono ya ha sido registrado!';
            errorCPFCNPJ = '¡Este CPF/CNPJ ya ha sido registrado!';
            break;
        }

        console.error(error);

        if (error.error.errors[0].includes('duplicate key')) {
          if (error.error.errors[0].includes('email')) {
            this.toastrService.error(errorEmail, '', { progressBar: true });
          } else if (error.error.errors[0].includes('phone')) {
            this.toastrService.error(errorPhone, '', { progressBar: true });
          } else if (error.error.errors[0].includes('cpf')) {
            this.toastrService.error(errorCPFCNPJ, '', { progressBar: true });
          }
        } else {
          this.toastrService.error(error.error.errors[0], '', { progressBar: true });
        }


      }
    });

  }

}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-user-associacao',
  templateUrl: './update-user-associacao.component.html',
  styleUrls: ['./update-user-associacao.component.scss']
})
export class UpdateUserAssociacaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  userId!: string;
  associationList!: AssociationResponseDto[];

  storedLanguage : string | null

  // offices = [
  //   { id: 1, name: 'cargo 1' },
  //   { id: 2, name: 'cargo 2' },
  //   { id: 3, name: 'cargo 3' },
  //   { id: 4, name: 'cargo 4' },
  //   { id: 5, name: 'cargo 5' }
  // ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private associationService: AssociationService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['associacao', [Validators.required]],
      // office: [null, [Validators.required]],
      association: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      document: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {

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

      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.userId = success._id;
          this.form.patchValue({
            name: success.name,
            email: success.email,
            // office: success.office,
            association: success.association?._id,
            phone: success.phone,
            document: success.document
          });

          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-associacao']);
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

    this.ngxSpinnerService.show();
    this.userService.updateById(this.userId, this.form.value).subscribe({
      next: (success) => {

        let successMessage = 'Usuário editado com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Usuário editado com sucesso!'
            break;
          case 'en':
            successMessage = 'User successfully edited!'
            break;
          case 'fr':
            successMessage = 'Utilisateur modifié avec succès !'
            break;
          case 'es':
            successMessage = '¡Usuario editado con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/controle-associacao']);
      },
      error: (error) => {
        console.error(error);
        this.ngxSpinnerService.hide();
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

}

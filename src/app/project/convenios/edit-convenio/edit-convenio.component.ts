import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { states, cities } from "estados-cidades";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConvenioService } from 'src/services/convenio.service';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ConvenioRequestDto } from 'src/dtos/convenio/convenio-request.dto';
import { LocalStorageService } from 'src/services/local-storage.service';
import { AssociationService } from 'src/services/association.service';
import { UserService } from 'src/services/user.service';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
@Component({
  selector: 'app-edit-convenio',
  templateUrl: './edit-convenio.component.html',
  styleUrls: ['./edit-convenio.component.scss']
})
export class EditConvenioComponent {
  form: FormGroup;
  statesList: string[] = states();
  citiesList: string[] = [];
  responseData: any;
  response: ConvenioRequestDto;
  year: number;
  associationList: AssociationResponseDto[];
  userList: UserListResponseDto[];
  inputclear = false;
  constructor(
    private formBuilder: FormBuilder,
    public localStorage: LocalStorageService,
    private userService: UserService,
    private location: Location,
    private associationService: AssociationService,
    private convenioService: ConvenioService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      number: ['', [Validators.required]],
      object: ['', [Validators.required]],
      price: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      datesub: ['', [Validators.required]],
      datemat: ['', [Validators.required]],
      situation: ['', [Validators.required]],
      association: ['', [Validators.required]],
      review: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      number: this.localStorage.getEditConvenio().register_number,
      object: this.localStorage.getEditConvenio().register_object,
      city: this.localStorage.getEditConvenio().city,
      state: this.localStorage.getEditConvenio().state,
      price: this.localStorage.getEditConvenio().value,
      datesub: this.localStorage.getEditConvenio().signature_date,
      datemat: this.localStorage.getEditConvenio().validity_date,
      situation: this.localStorage.getEditConvenio().situation,
      association: this.localStorage.getEditConvenio().associate_name,
      review: this.localStorage.getEditConvenio().reviewer,
    });
    this.year = new Date().getFullYear();
    this.getAssociation();
    this.getAdm();
  }
  getAssociation() {
    this.associationService.list().subscribe({
      next: (success) => {
        this.associationList = success;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getAdm() {
    this.userService.listByType(UserTypeEnum.administrador).subscribe({
      next: (data) => {
        this.userList = data;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }


  onSubmit() {
    this.response = {
      register_number: this.form.controls['number'].value,
      register_object: this.form.controls['object'].value,
      states: this.form.controls['state'].value,
      city: this.form.controls['city'].value,
      value: String(this.form.controls['price'].value),
      signature_date: this.form.controls['datesub'].value,
      validity_date: this.form.controls['datemat'].value,
      status: this.form.controls['situation'].value,
      associate_name: this.form.controls['association'].value,
      reviewer: this.form.controls['review'].value,
      work_plan: '0'
    }
    if (
      this.form.controls['number'].value !== '' &&
      this.form.controls['object'].value !== '' &&
      this.form.controls['state'].value !== '' &&
      this.form.controls['city'].value !== '' &&
      this.form.controls['datesub'].value !== '' &&
      this.form.controls['datemat'].value !== '' &&
      this.form.controls['situation'].value !== '' &&
      this.form.controls['review'].value !== ''
    ) {
      this.convenioService.updateConvenio(this.localStorage.getEditConvenio()._id, this.response).subscribe({
        next: (success) => {
          this.router.navigate(['/pages/convenios']);
          this.toastrService.success('Editado com sucesso!', '', { progressBar: true });
        },
        error: (error) => {
          console.error(error);
          this.toastrService.error(error.error.errors[0], 'Error ao editar!', { progressBar: true });
        }
      });
    } else{
      this.inputclear = true;
      setTimeout(() => {
        this.inputclear = false;
      }, 2000)
    }
  }

  backConvenio() {
    this.location.back();
  }

  getCity(state: string) {
    this.citiesList = cities(state) || []
  }
}

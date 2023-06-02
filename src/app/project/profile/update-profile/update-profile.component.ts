import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  form!: FormGroup;


  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,

  ) {
    this.form = this.formBuilder.group({
      name: [''],
      email: [''],
    });
  }


}
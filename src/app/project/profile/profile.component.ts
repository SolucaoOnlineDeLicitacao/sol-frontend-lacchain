import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  changePassword!: FormGroup;

  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    this.changePassword = this.formBuilder.group({
      password: [''],
      newPassword: [''],
      confirmNewPassword: [''],
    });
  }

  ngOnInit(): void {

  }

  open(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  exit() {
    this.modalService.dismissAll();
  }
}

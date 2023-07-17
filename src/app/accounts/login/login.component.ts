import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BidUpdateDateDto } from 'src/dtos/bid/bid-update-date.dto';
import { AuthService } from 'src/services/auth.service';
import { PlataformService } from 'src/services/plataform.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private plataformService: PlataformService,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      keep_conn: [false],
    });
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  clearSpace(event: any) {
    if(event.charCode === 32) {
      event.preventDefault()
    }
  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }

    this.ngxSpinnerService.show();

    this.authService.authenticate(this.form.value).subscribe({
      next: async (data) => {
        this.authService.setAuthenticatedUser(data);
        this.plataformService.list().subscribe({
          next: async (res: BidUpdateDateDto) => {
            const config: BidUpdateDateDto = {
              start_at: res.start_at,
              end_at: res.end_at
            }
            localStorage.setItem("plataform-config", JSON.stringify(config));
          },
          error: (error) => {
            console.error(error);
            this.toastrService.error(error.error.errors[0], undefined, { progressBar: true, });
            this.ngxSpinnerService.hide();
          }
        })
    
        this.router.navigate(['/pages/dashboard']);
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], undefined, { progressBar: true, });
        this.ngxSpinnerService.hide();
      }
    });

  }

}

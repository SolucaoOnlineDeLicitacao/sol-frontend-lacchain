import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-data-fornecedor',
  templateUrl: './user-data-fornecedor.component.html',
  styleUrls: ['./user-data-fornecedor.component.scss']
})
export class UserDataFornecedorComponent implements OnInit {

  user?: UserListResponseDto;

  constructor(
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.user = success;
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

}

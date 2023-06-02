import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/services/user.service';
import { Component, OnInit } from '@angular/core';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-control-administracao',
  templateUrl: './control-administracao.component.html',
  styleUrls: ['./control-administracao.component.scss']
})
export class ControlAdministracaoComponent implements OnInit {

  currentPage: number = 1;
  itensPerPage: number = 8;

  userList!: UserListResponseDto[];

  constructor(
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal
  ) {

  }

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.userService.listByType(UserTypeEnum.administrador).subscribe({
      next: (data) => {
        this.userList = data;
        this.ngxSpinnerService.hide();
      },
      error: (err) => {
        console.error(err);
        this.ngxSpinnerService.hide();
      }
    })
  }

  openModal(i: number) {
    this.userService.deleteUser = this.userList[i];
    this.userService.deleted = false;

    const modal = this.ngbModal.open(DeleteUserComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });

    modal.result.then((data: any) => {

    }, (error: any) => {
      if (this.userService.deleted) {
        this.userList.splice(i, 1);
      }
      this.userService.deleteUser = null;
      this.userService.deleted = false;
    });

  }

}

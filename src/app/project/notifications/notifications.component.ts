import { Component } from '@angular/core';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  user : any
  userNotification: any

  constructor(
    private userService: UserService
  ) {
  
  }

  ngOnInit(): void {
    const user: any = localStorage.getItem('user');
    const newUser = JSON.parse(user)
    this.getUserById(newUser.id)
  
  }

  getUserById(_id: string) {
    this.userService.getById(_id).subscribe({
      next: (success) => {
        this.userNotification = success.notification_list
       
     
      },
      error: (error) => {
        // this.ngxSpinnerService.hide();
      }
    });
  }

}

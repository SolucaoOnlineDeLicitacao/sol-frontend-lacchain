import { Component } from '@angular/core';
import { notificationsList } from 'src/services/notifications.mock';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifications = notificationsList;

}

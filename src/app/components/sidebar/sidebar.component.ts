import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  show = false;
  items = false;
  showReport:boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    
  }

  Usertoggle(value: string) {
    if(value === 'user')this.show = !this.show;
    this.items = !this.items
    
  }

  reportToggle() {
    this.showReport = !this.showReport;
  }
}

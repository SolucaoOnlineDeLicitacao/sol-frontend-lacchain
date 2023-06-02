import { Component } from '@angular/core';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent {
  itemgroupListt!: any;
 
   constructor(
     private datamockService: DatamockService
   ) {}
 
   ngOnInit(): void {
     this.itemgroupListt = this.datamockService.itens;
   }



}

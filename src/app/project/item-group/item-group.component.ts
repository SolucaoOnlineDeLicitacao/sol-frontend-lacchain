import { Component } from '@angular/core';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-item-group',
  templateUrl: './item-group.component.html',
  styleUrls: ['./item-group.component.scss']
})
export class ItemGroupComponent {
  itemgroupListt: any;
 
   constructor(
     private datamockService: DatamockService
   ) {}
 
   ngOnInit(): void {
     this.itemgroupListt = this.datamockService.itens;
   }


}

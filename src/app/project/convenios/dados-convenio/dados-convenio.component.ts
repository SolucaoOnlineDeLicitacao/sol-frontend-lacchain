import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { CostItemsService } from 'src/services/cost-items.service';
import { DatamockService } from 'src/services/datamock.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-dados-convenio',
  templateUrl: './dados-convenio.component.html',
  styleUrls: ['./dados-convenio.component.scss']
})
export class DadosConvenioComponent {
  costItemsList: CostItemsResponseDto[];

  
  constructor(
    public datamock: DatamockService,
    public localStorage: LocalStorageService,
  ) {
  }

  ngOnInit(): void {

  }

  // getItemList(){
  //     this.costItemsService.list().subscribe({
  //       next: (success) => {
  //         this.costItemsList = success;
  //         this.ngxSpinnerService.hide();
  //       },
  //       error: (error) => {
  //         this.ngxSpinnerService.hide();
  //       }
  //     });
  // }

  openModal(i: any) {
   
  }

  editPlano(i: any) {
    localStorage.setItem('plano', JSON.stringify(i));
  }

}

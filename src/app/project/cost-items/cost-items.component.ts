import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { CostItemsService } from 'src/services/cost-items.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteCostItemsComponent } from './delete-cost-items/delete-cost-items.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cost-items',
  templateUrl: './cost-items.component.html',
  styleUrls: ['./cost-items.component.scss']
})
export class CostItemsComponent implements OnInit {

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  costItemsList: CostItemsResponseDto[];

  constructor(
    private costItemsService: CostItemsService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.getCostItems();

  }

  
  getCostItems() {
    this.costItemsService.list().subscribe({
      next: (success) => {
        this.costItemsList = success;
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
      }
    });
  }

  dataItem(i: any, value: string) {
    if (value === 'edit') {
      this.router.navigate([`pages/itens-custo/editar-item/${i._id}`]);
    } else if (value === 'detail') {
      localStorage.setItem('editcostitems', JSON.stringify(i));
      this.router.navigate([`pages/itens-custo/dados-item/${i._id}`]);
    }
  }

  delete(i: any, Id: string) {
    localStorage.setItem('editcostitems', JSON.stringify(i));
    const modal = this.modalService.open(DeleteCostItemsComponent, { centered: true, backdrop: true, size: 'md', keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getCostItems();
    })
  }

}

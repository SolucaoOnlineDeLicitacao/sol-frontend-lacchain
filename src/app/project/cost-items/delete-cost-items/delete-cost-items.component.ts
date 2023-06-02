import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CostItemsService } from 'src/services/cost-items.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-delete-cost-items',
  templateUrl: './delete-cost-items.component.html',
  styleUrls: ['./delete-cost-items.component.scss']
})
export class DeleteCostItemsComponent implements OnInit {


  constructor(
    private costItemsService: CostItemsService,
    private ngxSpinnerService: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
  ) { 
  }

  ngOnInit(): void {
  }

  deleteItem() {
    this.ngxSpinnerService.show();
    this.costItemsService.delete(this.localStorage.getDataCostItems()._id).subscribe({
      next: (data) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Item deletado com sucesso!', '', { progressBar: true });
        this.costItemsService.deleted = true;
        this.ngbModal.dismissAll();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
        console.error(error);
        this.toastrService.error('Erro ao deletar item!', '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}
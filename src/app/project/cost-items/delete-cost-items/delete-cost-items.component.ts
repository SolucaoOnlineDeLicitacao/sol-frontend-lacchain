import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
    private translate: TranslateService,
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
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DELETE_ITEM'), '', { progressBar: true });
        this.costItemsService.deleted = true;
        this.ngbModal.dismissAll();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_DELETE_ITEM'), '', { progressBar: true });
        console.error(error);
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}
import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { supplierList } from 'src/services/supplier.mock';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-fornecedor',
  templateUrl: './delete-fornecedor.component.html',
  styleUrls: ['./delete-fornecedor.component.scss']
})
export class DeleteFornecedorComponent implements OnInit {
  @Input() fornecedorId!: number;
  @Output() excluirFornecedor: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {

    let cancel = document.getElementById('cancel');
    cancel?.focus();
  }

  deleteFornecedor() {
    this.deleteSupplierById();
    this.activeModal.close();
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  deleteSupplierById(): void {

    const index = supplierList.findIndex(supplier => supplier._id === this.fornecedorId);

    if (index !== -1) {
      supplierList.splice(index, 1);
      this.toastrService.success('Fornecedor excluído com sucesso!');
    }
  }


}

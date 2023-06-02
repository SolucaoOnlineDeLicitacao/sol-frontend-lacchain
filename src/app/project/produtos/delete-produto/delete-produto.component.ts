import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-delete-produto',
  templateUrl: './delete-produto.component.html',
  styleUrls: ['./delete-produto.component.scss']
})
export class DeleteProdutoComponent implements OnInit {


  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private productService: ProductService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
  ) { 
  }

  ngOnInit(): void {
  }

  deleteItem() {
    this.ngxSpinnerService.show();
    this.productService.delete(this.localStorage.getDataProdutos()._id).subscribe({
      next: (data) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Produto deletado com sucesso!', '', { progressBar: true });
        this.ngbModal.dismissAll();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
        console.error(error);
        this.toastrService.error('Erro ao deletar Produto!', '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}
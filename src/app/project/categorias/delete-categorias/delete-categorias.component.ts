import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/services/category.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-delete-categorias',
  templateUrl: './delete-categorias.component.html',
  styleUrls: ['./delete-categorias.component.scss']
})
export class DeleteCategoriasComponent implements OnInit {


  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
    private categoryService: CategoryService
  ) { 
  }

  ngOnInit(): void {
  }

  deleteCategory() {
    this.ngxSpinnerService.show();
    this.categoryService.delete(this.localStorage.getDataCategoria()._id).subscribe({
      next: (data) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Categoria deletada com sucesso!', '', { progressBar: true });
        this.ngbModal.dismissAll();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
        console.error(error);
        this.toastrService.error('Erro ao deletar categoria!', '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}

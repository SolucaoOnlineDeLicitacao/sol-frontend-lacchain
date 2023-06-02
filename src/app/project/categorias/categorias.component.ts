import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteProdutoComponent } from '../produtos/delete-produto/delete-produto.component';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { CategoryService } from 'src/services/category.service';
import { DeleteCategoriasComponent } from './delete-categorias/delete-categorias.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  categoryList: CategoryResponseDto[];

  constructor(
    private categoryService: CategoryService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.getCategory();

  }
  getCategory() {
    this.categoryService.getCategory().subscribe({
      next: success => {
        this.categoryList = success;
        this.ngxSpinnerService.hide();
      },
      error: error => {
        this.ngxSpinnerService.hide();
      }
    });
  }

  editCategory(i: any) {
      localStorage.setItem('editcategoria', JSON.stringify(i));
      this.router.navigate(['pages/categorias/editar-categoria']);
  }

  delete(i: any, Id: string) {
    localStorage.setItem('editcategoria', JSON.stringify(i));
    const modal = this.modalService.open(DeleteCategoriasComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getCategory();
    })
  }

}


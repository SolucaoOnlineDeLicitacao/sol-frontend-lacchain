import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/services/product.service';
import { ProductResponseDto } from 'src/dtos/product/product.response.dto';
import { DeleteProdutoComponent } from './delete-produto/delete-produto.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  productList: ProductResponseDto[];

  constructor(
    private productService: ProductService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.getProdutcs();

  }
  getProdutcs() {
    this.productService.getProduct().subscribe({
      next: (success) => {
        this.productList = success;
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
      }
    });
  }

  editItem(i: any) {
      localStorage.setItem('editprodutos', JSON.stringify(i));
      this.router.navigate(['pages/produtos/editar-produto']);
  }

  delete(i: any, Id: string) {
    localStorage.setItem('editprodutos', JSON.stringify(i));
    const modal = this.modalService.open(DeleteProdutoComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getProdutcs();
    })
  }

}

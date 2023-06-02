import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { DeleteAssociationComponent } from '../association/delete-association/delete-association.component';
import { supplierList } from 'src/services/supplier.mock';
import { DeleteFornecedorComponent } from './delete-fornecedor/delete-fornecedor.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent {

  currentPage: number = 1;
  itensPerPage: number = 8;
  fornecedor = supplierList;
  fornecedorId: number = 0;

  constructor(
    private ngbModal: NgbModal,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  openModal(id: number) {
    this.fornecedorId = id;
    const modalRef = this.ngbModal.open(DeleteFornecedorComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });
    modalRef.componentInstance.fornecedorId = id;
  }
}
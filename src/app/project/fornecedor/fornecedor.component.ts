import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteFornecedorComponent } from './delete-fornecedor/delete-fornecedor.component';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent {

  currentPage: number = 1;
  itensPerPage: number = 8;
  fornecedor: any;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngbModal: NgbModal,
    private toastrService: ToastrService,
    private _supplierService: SupplierService,
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text.length > 1)
        this.fornecedor = this.fornecedor.filter((item: any) =>
          item.name.toLowerCase().includes(text) ||
          item.cpf.toLowerCase().includes(text) ||
          item.address.city.toLowerCase().includes(text) 
        );
      else
        this.list();
    });

    this.list();
  }

  list() {
    this._supplierService.supplierList().subscribe((response: any) => {
      this.fornecedor = response;
      console.log(this.fornecedor)
    });
  }

  openModal(fornecedor: any) {
    const modalRef = this.ngbModal.open(DeleteFornecedorComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });
    modalRef.componentInstance.fornecedor = fornecedor;
    modalRef.result.then(data => {
      this.list()
    }, error => {
      console.error('error', error);
    });
  }
}
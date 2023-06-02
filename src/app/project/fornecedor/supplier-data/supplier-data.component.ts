import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { AllSuppliers, supplierList } from 'src/services/supplier.mock';

@Component({
  selector: 'app-supplier-data',
  templateUrl: './supplier-data.component.html',
  styleUrls: ['./supplier-data.component.scss']
})
export class SupplierDataComponent implements OnInit {

  fornecedor!: AllSuppliers | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private associationService: AssociationService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [''],
    });
  }

  ngOnInit(): void {

    const fornecedorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.fornecedor = supplierList.find(fornecedor => fornecedor._id === fornecedorId);
  }

  open(contentBlocked: any) {
    this.modalService.open(contentBlocked, { size: 'lg' });
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: 'lg' });
  }

  exit() {
    this.modalService.dismissAll();
  }

  handleBlock() {
    const fornecedorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    const supplier = supplierList.find(supplier => supplier._id === fornecedorId);
    if (supplier) {
      supplier.block = true;
      this.modalService.dismissAll();
    }
  }

  handleUnBlock() {
    const fornecedorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    const supplier = supplierList.find(supplier => supplier._id === fornecedorId);
    if (supplier) {
      supplier.block = false;
      this.modalService.dismissAll();
    }
  }

}

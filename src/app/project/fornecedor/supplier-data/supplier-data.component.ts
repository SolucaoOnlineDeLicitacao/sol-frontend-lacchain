import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { SupplierService } from 'src/services/supplier.service';

@Component({
  selector: 'app-supplier-data',
  templateUrl: './supplier-data.component.html',
  styleUrls: ['./supplier-data.component.scss']
})
export class SupplierDataComponent implements OnInit {

  fornecedor!: any | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private supplierService:SupplierService
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [''],
    });
  }

  ngOnInit(): void {

    const fornecedorId =this.activatedRoute.snapshot.paramMap.get('id');
    if(!fornecedorId) return;
    this.supplierService.getById(fornecedorId).subscribe({
      next: data => {
        this.fornecedor = data;
        console.log(this.fornecedor)
      },
      error: error => {
        console.log(error);
      }
    })
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
    // const fornecedorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    // const supplier = supplierList.find(supplier => supplier._id === fornecedorId);
    // if (supplier) {
    //   supplier.block = true;
    // }
    this.modalService.dismissAll();
  }

  handleUnBlock() {
    // const fornecedorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    // const supplier = supplierList.find(supplier => supplier._id === fornecedorId);
    // if (supplier) {
    //   supplier.block = false;
    // }
    this.modalService.dismissAll();
  }

}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllContrato } from 'src/services/association-contrato.mock';
import { convenioList } from 'src/services/association-convenio.mock';
import { AuthService } from 'src/services/auth.service';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-administration-lote-licitacao',
  templateUrl: './administration-lote-licitacao.component.html',
  styleUrls: ['./administration-lote-licitacao.component.scss']
})
export class AdministrationLoteLicitacaoComponent {
  convenio!: AllContrato | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthService,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [''],
    });
  }

  ngOnInit(): void {
    console.log(this.authService.getAuthenticatedUser());


    const convenioId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.convenio = convenioList.find(convenio => convenio._id === convenioId);
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

  isSectionOpen: boolean = false;

  toggleSection() {
    this.isSectionOpen = !this.isSectionOpen;
  }

}

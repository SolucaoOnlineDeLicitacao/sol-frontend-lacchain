import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { AuthService } from 'src/services/auth.service';
import { ConvenioService } from 'src/services/convenio.service';
import { ContractsService } from '../../../services/contract.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-associacao-contratos-data',
  templateUrl: './associacao-contratos-data.component.html',
  styleUrls: ['./associacao-contratos-data.component.scss']
})
export class AssociacaoContratosDataComponent {

  convenio!: ConvenioResponseDto | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public ontractsService: AuthService,
    private contractsService: ContractsService,
    private toastrService: ToastrService,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [''],
    });
  }

  ngOnInit(): void {
    const convenioId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!convenioId) return;
    this.contractsService.getContractById(convenioId).subscribe({
      next: data => {
        this.convenio = data;
      }
    });
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

  refused() {

  }

  approve() {

console.log('convenio',this.convenio)

    this.contractsService.singAssociation(this.convenio?._id!, { status: 'concluido', association_id: this.convenio?.association! }).subscribe(
      async success => {
        this.toastrService.success('Aceito com sucesso!', '', { progressBar: true });
      },
      async error => {
        this.toastrService.error('Erro ao aceitar', '', { progressBar: true });
      }
    )
  }

}

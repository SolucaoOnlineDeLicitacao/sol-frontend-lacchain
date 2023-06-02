import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllConvenios, convenioList } from 'src/services/association-convenio.mock';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-associacao-convenio-data',
  templateUrl: './associacao-convenio-data.component.html',
  styleUrls: ['./associacao-convenio-data.component.scss']
})
export class AssociacaoConvenioDataComponent {

  convenio!: AllConvenios | undefined;
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

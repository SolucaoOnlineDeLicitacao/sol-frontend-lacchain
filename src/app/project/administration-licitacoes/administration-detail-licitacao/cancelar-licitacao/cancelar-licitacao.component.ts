import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-cancelar-licitacao',
  templateUrl: './cancelar-licitacao.component.html',
  styleUrls: ['./cancelar-licitacao.component.scss']
})
export class CancelarLicitacaoComponent implements OnInit {
  constructor(
    public datamock: DatamockService,
    private modalService: NgbModal,
    private toastrService: ToastrService,

  ) { }
  ngOnInit(): void {

  }
  closeModal(value: string) {
    this.modalService.dismissAll();
    if (value === 'cancel') {
      this.toastrService.success('Cancelado com sucesso!', '', { progressBar: true });
    }
  }
}
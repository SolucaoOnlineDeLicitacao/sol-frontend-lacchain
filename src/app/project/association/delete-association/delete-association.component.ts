import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';

@Component({
  selector: 'app-delete-association',
  templateUrl: './delete-association.component.html',
  styleUrls: ['./delete-association.component.scss']
})
export class DeleteAssociationComponent implements OnInit {

  association!: AssociationResponseDto;

  constructor(
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.association = this.associationService.deleteAssociation!;
    let cancel = document.getElementById('cancel');
    cancel?.focus();
  }

  deleteAssociation() {
    this.ngxSpinnerService.show();
    this.associationService.delete(this.association._id).subscribe({
      next: (data) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Associação deletada com sucesso!', '', { progressBar: true });
        this.associationService.deleted = true;
        this.ngbModal.dismissAll();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
        console.error(error);
        this.toastrService.error('Erro ao deletar associação!', '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}

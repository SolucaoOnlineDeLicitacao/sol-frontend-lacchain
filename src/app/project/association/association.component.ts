import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { DeleteAssociationComponent } from './delete-association/delete-association.component';

@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss']
})
export class AssociationComponent implements OnInit {

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  associationList!: AssociationResponseDto[];

  constructor(
    private associationService: AssociationService,
    private ngbModal: NgbModal
  ){}

  ngOnInit(): void {

    this.associationService.list().subscribe({
      next: (success) => {
        this.associationList = success;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  openModal(i: number) {

    this.associationService.deleteAssociation = this.associationList[i];
    this.associationService.deleted = false;

    const modal = this.ngbModal.open(DeleteAssociationComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });



  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ModelContractService } from 'src/services/model-contract.service';

@Component({
  selector: 'app-delete-contract-templates',
  templateUrl: './delete-contract-templates.component.html',
  styleUrls: ['./delete-contract-templates.component.scss']
})
export class DeleteContractTemplatesComponent implements OnInit{

  form: FormGroup;
  name: string;
  constructor(
    private ngbModal: NgbModal,
    private _modelContractService:ModelContractService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,
  ) {}

  

  ngOnInit(): void {
    this.name =  this.localStorage.getDataModelContractId().name
  }
  
  onDelete() {
   console.log('teste',this.localStorage.getDataModelContractId());
    this._modelContractService.delete(this.localStorage.getDataModelContractId()._id).subscribe({
      next: (data) => {
        this.toastrService.success('Item deletado com sucesso!', '', { progressBar: true });
        this.ngbModal.dismissAll();

      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Erro ao deletar item!', '', { progressBar: true });
      }
    });
  }
  
  closeModal() {
    this.ngbModal.dismissAll();
  }

}

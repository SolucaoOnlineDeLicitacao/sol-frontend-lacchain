import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { AuthService } from 'src/services/auth.service';
import { ConvenioService } from 'src/services/convenio.service';
import { DatamockService } from 'src/services/datamock.service';
import { DeleteConvenioComponent } from './delete-convenio/delete-convenio.component';

@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.scss']
})
export class ConveniosComponent {

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  conveniosList!: any[];
  convenioList: ConvenioResponseDto[];

  constructor(
    private authbase: AuthService,
    private toastrService: ToastrService,
    private convenioService: ConvenioService,
    public router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getConvenio();
    if(this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);
  }

  getConvenio(){
    this.convenioService.getConvenio().subscribe({
      next: success => {
        this.convenioList = success;
      },
      error: error => {
        console.error(error);
      }
    });
  }

 
  editConvenio(i: any){
    localStorage.setItem('editconvenio', JSON.stringify(i));
    this.router.navigate(['pages/convenios/edit-convenio']);
  }

  
  delete(i: any) {
    localStorage.setItem('editconvenio', JSON.stringify(i));
    const modal = this.modalService.open(DeleteConvenioComponent, { centered: true, backdrop: true, size: 'md', keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getConvenio();
    })
  }

  detalheConvenios(item: any){
    this.router.navigate(['pages/convenios/detalhes-convenio']);
    localStorage.setItem('convenio', JSON.stringify(item));
  }
}

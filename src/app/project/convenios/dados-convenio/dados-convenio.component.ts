import { Component } from '@angular/core';
import { DatamockService } from 'src/services/datamock.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemGroupService } from 'src/services/item-group.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsItemGroupResponseDto } from 'src/dtos/item-group/item-of-group/item-itemgroup-response.dto';
import { ItemGroupRegisterResponseDto } from 'src/dtos/item-group/item-group-register-response.dto';
import { ConvenioResponseDto, WorkPlanInterface } from 'src/dtos/convenio/convenio-response.dto';
import { WorkPlanService } from 'src/services/work-plan.service';

@Component({
  selector: 'app-dados-convenio',
  templateUrl: './dados-convenio.component.html',
  styleUrls: ['./dados-convenio.component.scss']
})
export class DadosConvenioComponent {

  convenio: ConvenioResponseDto;
  countItemList: number;
  countItens: any;

  constructor(
    private workPlanService:WorkPlanService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.convenio = this.route.snapshot.data['agreement'];
  }


  deleteGroup(item: WorkPlanInterface) {
    this.workPlanService.delete(item._id).subscribe({
      next: success => {
        this.toastrService.success('Exluido com sucesso!', '', { progressBar: true });
      },
      error: error => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  addGroup() {
    this.router.navigate(['/pages/item-group/new-group']);
    localStorage.setItem('convenioId', this.convenio._id);
  }


  detailGroup(item: WorkPlanInterface) {
    this.router.navigate(['/pages/item-group']);
    localStorage.setItem('plano', JSON.stringify(item));
  }


  editPlano(item: WorkPlanInterface) {
    this.router.navigate(['/pages/item-group/edit-group/'+item._id]);
  }

}

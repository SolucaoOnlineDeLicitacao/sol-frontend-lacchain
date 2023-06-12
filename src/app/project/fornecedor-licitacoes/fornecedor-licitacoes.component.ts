import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AssociationService } from 'src/services/association.service';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-fornecedor-licitacoes',
  templateUrl: './fornecedor-licitacoes.component.html',
  styleUrls: ['./fornecedor-licitacoes.component.scss']
})
export class FornecedorLicitacoesComponent {
  @ViewChild('de') de: ElementRef;
  @ViewChild('ate') ate: ElementRef;

  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  ATEaLERT = 'Valor até';
  DEaLERT = 'Valor de';
  VALUEaLERT = false;
  licitacoesList: any = [];
  licitacoesId: any;
  associationList: AssociationResponseDto[];
  userList: any[];
  associateListInfo: any;
  constructor(
    private authbase: AuthService,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private _associationBidService: AssociationBidService,
    private association: AssociationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== 'fornecedor') this.router.navigate(['/pages/dashboard']);
    this._associationBidService.list().subscribe({
      next: (data: any[]) => {
        this.licitacoesList = data;
        console.log(this.licitacoesList);
        const filterList = this.licitacoesList.filter((licitacao: { invited_suppliers: string[]; }) => {
          if (licitacao.invited_suppliers && Array.isArray(licitacao.invited_suppliers)) {
            return licitacao.invited_suppliers.includes(this.authbase.getAuthenticatedUser().id);
          }
          return false;
        });
        console.log(filterList);
        this.licitacoesId = filterList;
        const listFiltred = this.licitacoesId.map((association: any) => { return this.userService.getById(association.association);});
        forkJoin(listFiltred).subscribe({
          next: (success: any) => {
            this.associateListInfo = success.map((item: any) => item.name);
          },
          error: (err) => {
            console.error(err);
          }
        });
    
        this.spinnerService.hide();
      },
      error: (error: any) => {
        this.spinnerService.hide();
      }
    });
    
  }

  toolSearch() {
    this.searchTool = !this.searchTool
  }


  detailBids(i: any) {
    this.router.navigate(['/pages/fornecedor/licitacoes/detalhes-licitacoes/' + i._id]);
    localStorage.setItem('licitacao', JSON.stringify(i));
  }


  searchValue(de: string, ate: string) {
    if (de > ate) {
      this.VALUEaLERT = true
      setTimeout(() => {
        this.VALUEaLERT = false
      }, 2500)
    } else {
      if (de === '' || de === undefined || de === null) {
        this.de.nativeElement.classList.add("border-danger", "border", "text-danger");
        this.DEaLERT = 'Valor necessário'
        setInterval(() => {
          this.de.nativeElement.classList.remove("border-danger", "border", "text-danger");
          this.DEaLERT = 'Valor de'
        }, 3000);
      }
      if (ate === '' || ate === undefined || ate === null) {
        this.ate.nativeElement.classList.add("border-danger", "border", "text-danger");
        this.ATEaLERT = 'Valor necessário'
        setInterval(() => {
          this.ate.nativeElement.classList.remove("border-danger", "border", "text-danger");
          this.ATEaLERT = 'Valor até'
        }, 3000);
      }
    }

  }

}

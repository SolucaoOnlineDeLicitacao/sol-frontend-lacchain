import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, forkJoin } from 'rxjs';
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
  associationName: any;
  listAssociationInfo: any;

  idArray: string[] = [];
  listIdAssociation: any;
  constructor(
    private authbase: AuthService,
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private _associationBidService: AssociationBidService,
    private associationService:AssociationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== 'fornecedor') this.router.navigate(['/pages/dashboard']);
    this._associationBidService.list().subscribe({
      next: (data: any[]) => {
        console.log('licitações', data);
        this.licitacoesList = data;
        const observables: Observable<any>[] = [];
        data.forEach((item: any, index: number) => {
          this.listIdAssociation = item.agreement?.association;
          console.log(item.agreement?.association);
          observables.push(this.associationService.getById(this.listIdAssociation));
          observables[index].subscribe({
            next: (response: any) => {
              this.licitacoesList[index].name = response.name;
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        });
        forkJoin(observables).subscribe({
          next: (responses) => {
            console.log(responses);
            this.listAssociationInfo = responses;
            console.log(this.listAssociationInfo, 'lista de associação');
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

import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, forkJoin } from "rxjs";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { AssociationBidService } from "src/services/association-bid.service";
import { AssociationService } from "src/services/association.service";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";

@Component({
  selector: "app-fornecedor-licitacoes",
  templateUrl: "./fornecedor-licitacoes.component.html",
  styleUrls: ["./fornecedor-licitacoes.component.scss"],
})
export class FornecedorLicitacoesComponent {
  @ViewChild("de") de: ElementRef;
  @ViewChild("ate") ate: ElementRef;

  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  ATEaLERT = "Valor até";
  DEaLERT = "Valor de";
  VALUEaLERT = false;
  licitacoesList: any = [];
  licitacoesListFilter: any = [];
  licitacoesId: any;
  associationName: any;
  listAssociationInfo: any;

  idArray: string[] = [];
  listIdAssociation: any;
  constructor(
    private authbase: AuthService,
    private spinnerService: NgxSpinnerService,
    private _associationBidService: AssociationBidService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== "fornecedor") this.router.navigate(["/pages/dashboard"]);
    this.spinnerService.show();
    this._associationBidService.listForProposalSupplier().subscribe({
      next: (data: any[]) => {
        this.licitacoesListFilter = this.licitacoesList = data
        this.spinnerService.hide();
      },
      error: (error: any) => {
        console.error(error);
        this.spinnerService.hide();
      }
    })
  }

  toolSearch() {
    this.searchTool = !this.searchTool;
  }

  detailBids(i: any) {
    this.router.navigate(["/pages/fornecedor/licitacoes/detalhes-licitacoes/" + i._id]);
  }

  searchValue(de: string, ate: string) {
    if (de > ate) {
      this.VALUEaLERT = true;
      setTimeout(() => {
        this.VALUEaLERT = false;
      }, 2500);
    } else {
      if (de === "" || de === undefined || de === null) {
        this.de.nativeElement.classList.add("border-danger", "border", "text-danger");
        this.DEaLERT = "Valor necessário";
        setInterval(() => {
          this.de.nativeElement.classList.remove("border-danger", "border", "text-danger");
          this.DEaLERT = "Valor de";
        }, 3000);
      }
      if (ate === "" || ate === undefined || ate === null) {
        this.ate.nativeElement.classList.add("border-danger", "border", "text-danger");
        this.ATEaLERT = "Valor necessário";
        setInterval(() => {
          this.ate.nativeElement.classList.remove("border-danger", "border", "text-danger");
          this.ATEaLERT = "Valor até";
        }, 3000);
      }
    }
  }

  filter(event: any) {
    const search = event.target.value;
    this.licitacoesListFilter = this.licitacoesList.filter(
      (item: any) =>
        item.bid_count?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.association?.association?.name.toLowerCase().includes(search.toLowerCase())
    );
  }
}

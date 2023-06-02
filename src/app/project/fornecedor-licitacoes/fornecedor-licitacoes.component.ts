import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-fornecedor-licitacoes',
  templateUrl: './fornecedor-licitacoes.component.html',
  styleUrls: ['./fornecedor-licitacoes.component.scss']
})
export class FornecedorLicitacoesComponent {
  @ViewChild('de') de: ElementRef;
  @ViewChild('ate') ate: ElementRef;

  licitacoesList!: any[];
  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  ATEaLERT = 'Valor até';
  DEaLERT = 'Valor de';
  VALUEaLERT = false;
  constructor(
    private datamockService: DatamockService,
    private authbase: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.licitacoesList = this.datamockService.licitacoes;
    if (this.authbase.getAuthenticatedUser().type !== 'fornecedor') this.router.navigate(['/pages/dashboard']);
  }

  toolSearch() {
    this.searchTool = !this.searchTool
  }

  detailBids(i: any) {
    this.router.navigate(['/pages/fornecedor/detalhes-licitacoes']);
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

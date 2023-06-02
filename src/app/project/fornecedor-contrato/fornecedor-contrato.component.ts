import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-fornecedor-contrato',
  templateUrl: './fornecedor-contrato.component.html',
  styleUrls: ['./fornecedor-contrato.component.scss']
})
export class FornecedorContratoComponent {
  contratosList!: any[];
  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  constructor(
    private datamockService: DatamockService,
    private authbase: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void{
    this.contratosList = this.datamockService.contratos;
    if(this.authbase.getAuthenticatedUser().type !== 'fornecedor') this.router.navigate(['/pages/dashboard']);
  }

  toolSearch(){
    this.searchTool = !this.searchTool
  }

  detailContract(i: any){
    this.router.navigate(['/pages/fornecedor/contratos/contrato-supplier']);
    localStorage.setItem('contrato', JSON.stringify(i));
  }


}

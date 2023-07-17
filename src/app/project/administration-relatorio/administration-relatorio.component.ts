import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { isArray } from 'chart.js/dist/helpers/helpers.core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-administration-relatorio',
  templateUrl: './administration-relatorio.component.html',
  styleUrls: ['./administration-relatorio.component.scss']
})
export class AdministrationRelatorioComponent {
  BarChar: any = []
  licitacoesList: any = [];
  currentPage: number = 1;
  itensPerPage: number = 5;
  totalBidValue: any = 0
  map: Map<string, any[]> = new Map()
  objKeys: any
  
  storedLanguage : string | null

  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    Chart.register(...registerables)
    if (this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);
    
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesList = data.filter((item: any) =>
        item.status === 'completed' || item.status === 'awaiting' || item.status === 'open');
        this.spinnerService.hide(); 
        this.setMapByStatus(data)
        this.graphic()
        
      },
      error: error => {
        this.spinnerService.hide();
      }
    })
    
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  setMapByStatus(data: any) {
    for(let iterator of data) {
      if (!this.map.has(iterator.status)) {
        this.map.set(iterator.status, [iterator])
        
      } else {
        const oldArray = this.map.get(iterator.status)
        if(oldArray && Array.isArray(oldArray)) {
          oldArray.push(iterator)  
          this.map.set(iterator.status, oldArray )
         
          
        }
        
      }
      
    }
    this.objKeys = [...this.map.keys()]

  }



  graphic() {
    let data = [
      'Aguardando liberação',
      'Liberada',
      'Aberta',
      'Aguardando desempate',
      'Em análise',
      'Concluída',
      'Cancelada',
      'Fracassada',
      'Reaberta',
      'Deserta',
      'Em rascunho'
    ]
    let label = 'Gráfico Licitações'

    switch(this.storedLanguage) {
      case 'pt': 
        data = [
          'Aguardando liberação',
          'Liberada',
          'Aberta',
          'Aguardando desempate',
          'Em análise',
          'Concluída',
          'Cancelada',
          'Fracassada',
          'Reaberta',
          'Deserta',
          'Em rascunho',
          'Devolvida'
        ]
        break;
      case 'en':
        data = [
          'Waiting for release',
          'Released',
          'Open',
          'Waiting for tiebreaker',
          'Under analysis',
          'Completed',
          'Cancelled',
          'Failed',
          'Reopened',
          'Deserted',
          'Draft',
          'Returned'
          ]
        break;
      case 'fr':
        data = [
          'En attente de libération',
          'Libérée',
          'Ouverte',
          "En attente d'un dénouement",
          "En cours d'analyse",
          'Terminée',
          'Annulée',
          'Échouée',
          'Réouverte',
          'Abandonnée',
          'Brouillon',
          'Revenu'
          ]
        break;
      case 'es':
        data = [
          'Esperando liberación',
          'Liberada',
          'Abierta',
          'Esperando desempate',
          'En análisis',
          'Completada',
          'Cancelada',
          'Fracasada',
          'Reabierta',
          'Desierta',
          'En borrador',
          'Devuelto'
        ]
        break;
    }

    switch(this.storedLanguage) {
      case 'pt': 
        label = 'Gráfico Licitações'
        break;
      case 'en':
        label = 'Bidding Chart'
        break;
      case 'fr':
        label = "Graphique des appels d'offres"
        break;
      case 'es':
        label = 'Gráfico de licitaciones'
        break;
    }
  
    new Chart(
      'acquisitions',
      {
        type: 'bar',
        data: {
          labels: data.map(ele => ele),
          datasets: [{
            
            label: label,
            data: [
              this.map.get('awaiting')?.length,
              this.map.get('released')?.length,
              this.map.get('open')?.length,
              this.map.get('tiebreaker')?.length,
              this.map.get('analysis')?.length,
              this.map.get('completed')?.length,
              this.map.get('canceled')?.length,
              this.map.get('failed')?.length,
              this.map.get('reopened')?.length,
              this.map.get('reopened')?.length,
              this.map.get('draft')?.length,
              this.map.get('returned')?.length],
            indexAxis: 'y',
            
            backgroundColor: [
              'rgba(242, 227, 7)',
              'rgba(4, 138, 33)',
              'rgba(45, 237, 87)',
              'rgba(242, 227, 7)',
              'rgba(251, 255, 13)',
              'rgba(45, 237, 87)',
              'rgba(242, 0, 0)',
              'rgba(242, 0, 0)',
              'rgba(5, 125, 2)',
              'rgba(173, 173, 168)',
              'rgba(130, 127, 127)'
            ],
            borderColor: [
              'rgb(255, 205, 86)',
              'rgb(4, 138, 33)',
              'rgb(45, 237, 87)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgb(75, 192, 192)',
              'rgb(242, 0, 0)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(255, 205, 86, 0.2)'
            ],
            borderWidth: 1
          }]
        }
      }
    )

    this.getTotalValue()

  }

  getTotalValue() {
     for(let i = 0; i < this.licitacoesList.length; i ++) {
          this.totalBidValue += Number(this.licitacoesList[i]!.agreement?.value)
        }
    
  }


  detailBids(i: any) {
    this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
  }

}

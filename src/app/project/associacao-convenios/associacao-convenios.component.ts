import { Component } from '@angular/core';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { convenioList } from 'src/services/association-convenio.mock';
import { licitacaoList } from 'src/services/association-licitacao.mock';
import { ConvenioService } from 'src/services/convenio.service';

@Component({
  selector: 'app-associacao-convenios',
  templateUrl: './associacao-convenios.component.html',
  styleUrls: ['./associacao-convenios.component.scss']
})
export class AssociacaoConveniosComponent {

  convenios: ConvenioResponseDto[] = [];

  constructor(
    private conveniosService: ConvenioService,
  ) {

  }

  ngOnInit(): void {
    this.conveniosService.getConvenio().subscribe({
      next: data => {
        this.convenios = data;
      },
      error: error => {
        console.error(error)
      }
    })
  }

}

import { Component } from '@angular/core';
import { contratoList } from 'src/services/association-contrato.mock';

@Component({
  selector: 'app-associacao-contratos',
  templateUrl: './associacao-contratos.component.html',
  styleUrls: ['./associacao-contratos.component.scss']
})
export class AssociacaoContratosComponent {
  convenios = contratoList;
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-associacao-licitacao-view-proposal',
  templateUrl: './associacao-licitacao-view-proposal.component.html',
  styleUrls: ['./associacao-licitacao-view-proposal.component.scss']
})
export class AssociacaoLicitacaoViewProposalComponent {
  isSectionOneOpen: boolean = false;
  isSectionTwoOpen: boolean = false;

  toggleSectionOne() {
    this.isSectionOneOpen = !this.isSectionOneOpen;
  }

  toggleSectionTwo() {
    this.isSectionTwoOpen = !this.isSectionTwoOpen;
  }

}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from 'src/services/supplier.service';
import { RecusarPropostaModalComponent } from './components/recusar-proposta-modal/recusar-proposta-modal.component';
import { AceitarPropostaModalComponent } from './components/aceitar-proposta-modal/aceitar-proposta-modal.component';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-associacao-licitacao-view-proposal',
  templateUrl: './associacao-licitacao-view-proposal.component.html',
  styleUrls: ['./associacao-licitacao-view-proposal.component.scss']
})
export class AssociacaoLicitacaoViewProposalComponent {
  isSectionOneOpen: boolean = false;
  isSectionTwoOpen: boolean = false;

  response: any;

  valueEsteemed: any;

  openAccordion: boolean[] = [];

  activeItemIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private modalService: NgbModal,
    private accordionConfig: NgbAccordionConfig
  ) {
    this.accordionConfig.closeOthers = true;
  }

  ngOnInit(): void {
    this.listProposal();
  }

  listProposal() {
    this.route.data.subscribe({
      next: (data) => {
        this.response = data["proposals"];
        console.log(this.response)
        if (this.response.proposals.length > 0) {
          this.valueEsteemed = this.response.proposals.reduce((acc: number, item: any) => {
            if (item.total_value) {
              return acc + Number(item.total_value);
            } else {
              return acc;
            }
          }, 0);

          for (let iterator of this.response.proposals) {
            Object.assign(iterator, { isOpen: false });
          }

        }

        console.log('dps do destaque', this.response);

      }
    })

  }

  toggleSectionOne() {
    this.isSectionOneOpen = !this.isSectionOneOpen;
  }

  toggleSectionTwo() {
    this.isSectionTwoOpen = !this.isSectionTwoOpen;
  }

  refuse(proposal: any) {
    console.log('recusar', proposal);
    localStorage.setItem('proposalAction', JSON.stringify(proposal))
    const modalRef = this.modalService.open(RecusarPropostaModalComponent, { centered: true });
    modalRef.result.then(data => {
    }, error => {
      setTimeout(() => {
        this.listProposal();
        console.log('teste')
      }, 10000);
    });
  }

  view(proposal: any) {
    console.log('ver', proposal)
  }

  accept(proposal: any) {
    console.log('aceitar', proposal)
    localStorage.setItem('proposalAction', JSON.stringify(proposal))
    const modalRef = this.modalService.open(AceitarPropostaModalComponent, { centered: true, size: 'sm' });
    modalRef.result.then(data => {
    }, error => {
      setTimeout(() => {
        this.listProposal();
        console.log('teste')
      }, 10000);
    });
  }

  setActiveItem(index: number) {
    if (this.activeItemIndex === index) {
      this.activeItemIndex = -1;
    } else {
      this.activeItemIndex = index;
    }
  }

  isActiveItem(index: number) {
    return this.activeItemIndex === index;
  }

  isIconUp(index: number) {
    return this.response.proposals[index].isOpen;
  }

  toggleItem(index: number) {
    this.response.proposals[index].isOpen = !this.response.proposals[index].isOpen;
  }


}

import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ModelContractService } from "src/services/model-contract.service";
import { ModelContractDto } from "src/dtos/model-contract/model-contract.copy";
import * as moment from "moment";
import { LanguageContractEnum } from "src/enums/language-contract.enum";

@Component({
  selector: "app-contract-templates",
  templateUrl: "./contract-templates.component.html",
  styleUrls: ["./contract-templates.component.scss"],
})
export class ContractTemplatesComponent {
  currentPage: number = 1;

  templateList!: ModelContractDto[];

  constructor(
    private ngbModal: NgbModal,
    private router: Router,
    private _modelContractService: ModelContractService
  ) {}

  ngOnInit(): void {
    this.getContract();
  }

  getContract() {
    this._modelContractService.list().subscribe({
      next: success => {
        for (let data of success) {
          data.createdAt = moment(success.createdAt).format("DD/MM/YYYY");
        }

        this.templateList = success;
      },
    });
  }

  editContract(_id: string) {
    this.router.navigate([`pages/modelo-contratos/editar-modelo/${_id}`]);
  }

  //openModalDelete(item: ModelContractDto, _id:string) {
  //
  //  localStorage.setItem('editModelContracitems', JSON.stringify(item));

  //  const modal = this.ngbModal.open(DeleteContractTemplatesComponent, { centered: true, backdrop: true, size: 'md', keyboard: false })
  //  modal.result.then((result) => {
  //  }, err => {
  //    this.getContract();
  //  })
  //}

  handlerLanguage(lang: LanguageContractEnum) {
    switch (lang) {
      case LanguageContractEnum.portuguese:
        return "CREATE_BIDDING.SELECT_LANGUAGE_PORTUGUESE";
      case LanguageContractEnum.english:
        return "CREATE_BIDDING.SELECT_LANGUAGE_ENGLISH";
      case LanguageContractEnum.spanish:
        return "CREATE_BIDDING.SELECT_LANGUAGE_SPANISH";
      case LanguageContractEnum.french:
        return "CREATE_BIDDING.SELECT_LANGUAGE_FRENCH";
      default:
        return "--";
    }
  }
}

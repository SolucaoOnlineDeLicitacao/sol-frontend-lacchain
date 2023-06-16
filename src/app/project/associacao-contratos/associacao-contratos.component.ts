import { Component } from "@angular/core";
import { ConvenioResponseDto } from "src/dtos/convenio/convenio-response.dto";
import { ConvenioService } from "src/services/convenio.service";
import { ContractsService } from "../../../services/contract.service";
import { ContractResponseDto } from "../../../dtos/contratos/convenio-response.dto";

@Component({
  selector: "app-associacao-contratos",
  templateUrl: "./associacao-contratos.component.html",
  styleUrls: ["./associacao-contratos.component.scss"],
})
export class AssociacaoContratosComponent {
  convenios: ContractResponseDto[] = [];

  constructor(
    private _contractsService: ContractsService,
    ) {}

  ngOnInit(): void {
    this._contractsService.getContract().subscribe({
      next: data => {
        this.convenios = data;
      },
      error: error => {
        console.error(error);
      },
    });
  }
}

import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConvenioResponseDto, WorkPlanInterface } from "src/dtos/convenio/convenio-response.dto";
import { AuthService } from "src/services/auth.service";

@Component({
  selector: "app-associacao-convenio-data",
  templateUrl: "./associacao-convenio-data.component.html",
  styleUrls: ["./associacao-convenio-data.component.scss"],
})
export class AssociacaoConvenioDataComponent {
  convenio!: ConvenioResponseDto | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  response: ConvenioResponseDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [""],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.response = data["agreement"];
      },
    });
  }

  open(contentBlocked: any) {
    this.modalService.open(contentBlocked, { size: "lg" });
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: "lg" });
  }

  exit() {
    this.modalService.dismissAll();
  }

  isSectionOpen: boolean = false;

  toggleSection() {
    this.isSectionOpen = !this.isSectionOpen;
  }

  sumValues(item: WorkPlanInterface[]) {
    return item.reduce((ac, item) => ac + item.product.reduce((acc, curr) => acc + curr.unitValue, 0), 0);
  }

  sum(item: { quantity: number; unitValue: number; costItems: any; _id: string }[]) {
    return item.reduce((ac, item) => ac + item.quantity * item.unitValue, 0);
  }
}
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CostItemsResponseDto } from "src/dtos/cost-items/cost-items-response.dto";
import { ItemsItemGroupRequestDto } from "src/dtos/item-group/item-of-group/item-itemgroup-request.dto";
import { CostItemsService } from "src/services/cost-items.service";
import { Location } from "@angular/common";
import { LocalStorageService } from "src/services/local-storage.service";
import { WorkPlanService } from "src/services/work-plan.service";
import { WorkPlanProductInterface, WorkPlanRegisterRequest } from "src/dtos/workPlan/work-plan-register-request.dto";
import { ConvenioService } from "src/services/convenio.service";

@Component({
  selector: "app-new-group",
  templateUrl: "./new-group.component.html",
  styleUrls: ["./new-group.component.scss"],
})
export class NewGroupComponent implements OnInit, OnDestroy {
  costItemsList: CostItemsResponseDto[];
  form: FormGroup;
  isSubmit: boolean = false;
  request: WorkPlanRegisterRequest;
  itemList: ItemCustom[] = [];
  convenioId: string;

  constructor(
    private costItemsService: CostItemsService,
    private workPlanService: WorkPlanService,
    private formBuilder: FormBuilder,
    private location: Location,
    private toastrService: ToastrService,
    private convenioService: ConvenioService
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      items: ["", [Validators.required]],
      price: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.convenioId = localStorage.getItem("convenioId") || "";
    this.getCostItems();
  }

  ngOnDestroy(): void {
    localStorage.removeItem("convenioId");
  }

  getCostItems() {
    this.costItemsService.list().subscribe({
      next: success => {
        this.costItemsList = success;
      },
      error: error => {
        console.error(error);
      },
    });
  }

  addItem(): void {
    if (this.form.invalid) {
      return;
    }
    const name = this.form.controls["name"].value;

    const costItems = this.costItemsList.find(item => item._id === this.form.controls["items"].value);

    if (!costItems) {
      this.toastrService.error("Item não encontrado!", "", { progressBar: true });
      return;
    }
    const item: ItemCustom = {
      costItems: costItems,
      quantity: this.form.controls["quantity"].value,
      unitValue: this.form.controls["price"].value,
    };
    this.itemList.push(item);

    this.form.reset();
    this.form.controls["name"].setValue(name);
  }

  removeItem(item: ItemCustom) {
    const listArray = this.itemList.indexOf(item);
    if (listArray !== -1) this.itemList.splice(listArray, 1);
  }

  onSubmit() {
    this.isSubmit = true;

    if (this.form.controls["name"].invalid || !this.itemList.length) {
      return;
    }

    this.request = {
      name: this.form.controls["name"].value,
      product: this.itemList.map(item => {
        return { quantity: item.quantity, unitValue: item.unitValue, costItems: item.costItems._id as string };
      }),
    };

    this.workPlanService.create(this.request).subscribe({
      next: success => {
        this.convenioService.addWorkPlan(this.convenioId, { workPlanId: success._id }).subscribe({
          next: success => {
            this.toastrService.success("Grupo cadastrado com sucesso!", "", { progressBar: true });
            this.location.back();
          },
          error: error => {
            console.error(error);
            this.toastrService.error("Error ao cadastrar o grupo!", "", { progressBar: true });
            this.toastrService.error(error.error.errors[0], "", { progressBar: true });
          },
        });
      },
      error: error => {
        console.error(error);
        this.toastrService.error("Error ao cadastrar o grupo!", "", { progressBar: true });
        this.toastrService.error(error.error.errors[0], "", { progressBar: true });
      },
    });
  }
  goBack() {
    this.location.back();
  }
}

interface ItemCustom {
  quantity: number;
  unitValue: number;
  costItems: CostItemsResponseDto;
}

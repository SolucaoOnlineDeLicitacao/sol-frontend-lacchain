import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { ItemsItemGroupRequestDto } from 'src/dtos/item-group/item-of-group/item-itemgroup-request.dto';
import { ItemGroupRequestDto } from 'src/dtos/item-group/itemgroup-request.dto';
import { CostItemsService } from 'src/services/cost-items.service';
import { ItemGroupService } from 'src/services/item-group.service';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ItemsItemGroupResponseDto } from 'src/dtos/item-group/item-of-group/item-itemgroup-response.dto';
import { WorkPlanRegisterRequest } from 'src/dtos/workPlan/work-plan-register-request.dto';
import { WorkPlanService } from 'src/services/work-plan.service';
import { WorkPlanInterface } from 'src/dtos/convenio/convenio-response.dto';
@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  costItemsList: CostItemsResponseDto[];
  form: FormGroup;
  isSubmit: boolean = false;
  response: WorkPlanInterface;
  request: WorkPlanRegisterRequest;
  itemList: ItemCustom[] = [];

  constructor(
    private costItemsService: CostItemsService,
    private workPlanService: WorkPlanService,
    public localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    private location: Location,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      items: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCostItems();
    this.response = this.route.snapshot.data['workPlan'];

    this.form.patchValue({
     name: this.response.name,
    });
    this.itemList = this.response.product
  }


  getCostItems() {
    this.costItemsService.list().subscribe({
      next: (success) => {
        console.log(success);
        this.costItemsList = success;
      },
      error: (error) => {
        console.log(error)
      }
    });
  }


  addItemList() {
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

  OnSubmit() {
    this.request = {
      name: this.form.controls['name'].value,
      product: this.itemList.map(item => {
        return { quantity: item.quantity, unitValue: item.unitValue, costItems: item.costItems._id as string };
      }),
    }

    this.workPlanService.update(this.response._id, this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Grupo editado com sucesso!', '', { progressBar: true });
        this.location.back();
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Error ao editar o grupo!', '', { progressBar: true });
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { ItemsItemGroupRequestDto } from 'src/dtos/item-group/item-itemgroup-request.dto';
import { ItemGroupRequestDto } from 'src/dtos/item-group/itemgroup-request.dto';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto,';
import { CostItemsService } from 'src/services/cost-items.service';
import { ItemGroupService } from 'src/services/item-group.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent {
  costItemsList: CostItemsResponseDto[];
  form: FormGroup;
  isSubmit: boolean = false;
  request: ItemGroupRequestDto;
  constructor(
    private costItemsService: CostItemsService,
    private itemGroupService: ItemGroupService,
    private formBuilder: FormBuilder,
    private location: Location,

    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      item: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCostItems();
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
  addMore(){
    
  }

  OnSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    this.request = {
      name: this.form.controls['name'].value,
      items: {
        cost_item_id: this.form.controls['item'].value,
        quantity: this.form.controls['quantity'].value,
        estimated_cost: this.form.controls['price'].value
      },
    }

    this.itemGroupService.register(this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Grupo cadastrado com sucesso!', '', { progressBar: true });
        this.location.back();

      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Error ao cadastrar o grupo!', '', { progressBar: true });
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }
}


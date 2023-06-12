import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cost-items-data',
  templateUrl: './cost-items-data.component.html',
  styleUrls: ['./cost-items-data.component.scss']
})
export class CostItemsDataComponent implements OnInit {

  costItems: CostItemsResponseDto;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    public location:Location
  ) {

  }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.costItems = data["costItem"];
        this.ngxSpinnerService.hide();
      }
    })
  }

  goBack(){
    this.location.back();
  }
}

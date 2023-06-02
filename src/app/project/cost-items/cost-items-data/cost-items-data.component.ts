import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { AssociationService } from 'src/services/association.service';
import { CostItemsService } from 'src/services/cost-items.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-cost-items-data',
  templateUrl: './cost-items-data.component.html',
  styleUrls: ['./cost-items-data.component.scss']
})
export class CostItemsDataComponent implements OnInit {

  costItems: CostItemsResponseDto;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private costItemsService: CostItemsService,
    private router: Router,
    public localStorage: LocalStorageService,
  ) {

  }

  ngOnInit(): void {

  }
}

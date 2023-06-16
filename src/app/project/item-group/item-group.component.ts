import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { WorkPlanInterface } from "src/dtos/convenio/convenio-response.dto"; 
import { LocalStorageService } from "src/services/local-storage.service";
import { WorkPlanService } from "src/services/work-plan.service"; 

@Component({
  selector: "app-item-group",
  templateUrl: "./item-group.component.html",
  styleUrls: ["./item-group.component.scss"],
})
export class ItemGroupComponent {
  itemgroupListt: any;
  response: WorkPlanInterface; 

  constructor(
    public localStorage: LocalStorageService,
    public router: Router,
    private workPlanService: WorkPlanService 
  ) {}

  ngOnInit(): void {
    this.workPlanService.getById(this.localStorage.getDataPlano()._id).subscribe({ 
      next: success => (this.response = success), 
      error: error => console.error(error), 
    });
  }

  dataItem(i: string) { 
    localStorage.setItem("editcostitems", JSON.stringify(i)); 
    this.router.navigate([`pages/itens-custo/dados-item/${i}`]);
  }
}

import { Component } from '@angular/core';
import { ReportsService } from 'src/services/reports.service';

@Component({
  selector: 'app-report-generated',
  templateUrl: './report-generated.component.html',
  styleUrls: ['./report-generated.component.scss']
})
export class ReportGeneratedComponent {

  response: any = [];

  constructor(
    private reportService: ReportsService
  ) { }

  ngOnInit(): void {
    this.reportService.getReportGenerated().subscribe({
      next: data => {
        this.response = data
      }
    })
  }

}

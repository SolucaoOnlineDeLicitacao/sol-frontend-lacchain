import { Component } from '@angular/core';
import { ReportsService } from 'src/services/reports.service';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-report-generated',
  templateUrl: './report-generated.component.html',
  styleUrls: ['./report-generated.component.scss']
})
export class ReportGeneratedComponent {

  response: any = [];

  currentPage = 1;
  itemsPerPage = 5;

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

  donwload(item: any) {

    const archivePath = item.archive;
    const startIndex = archivePath.lastIndexOf("/") + 1;
    const endIndex = archivePath.indexOf(".xlsx");
    const reportName = archivePath.substring(startIndex, endIndex);

    this.reportService.download(item._id).subscribe({
      next: (data: any) => {

        const arrayBuffer = Buffer.from(data.data);
        const blob = new Blob([arrayBuffer], { type: data.type });

        const fileName = reportName;

        saveAs(blob, fileName + '.xlsx');
      }
    })

  }

}

import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ReportContractResponseDto } from "src/dtos/reports/report-contract.response.dto";
import { Observable, map, catchError } from 'rxjs';

@Injectable()
export class ReportsService extends BaseService {

  private url = `${environment.api.path}/report`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getData() {
    return this.httpClient
      .get<ReportContractResponseDto>(`${this.url}`, this.authorizedHeader);
  }

  getReportGenerated() {
    return this.httpClient
      .get(`${this.url}/report-generated`, this.authorizedHeader);
  }

  public downloadExcel(type: string): void {
    const downloadUrl = 'download-data/' + type;

    const userJson = localStorage.getItem('user') as string;
    const user = JSON.parse(userJson);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user?.token}`,
    });

    this.httpClient
      .get(`${this.url}/${downloadUrl}`, {
        headers: headers,
        responseType: 'blob', 
      })
      .subscribe((response) => {
        this.saveExcelFile(response);
      });
  }

  private saveExcelFile(blob: Blob): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'report.xlsx';

    downloadLink.click();

    window.URL.revokeObjectURL(downloadLink.href);
  }

  download(_id: string) {
    return this.httpClient
      .get(`${this.url}/download-report/${_id}`, this.authorizedHeaderFile)
      .pipe(map(response => response), catchError(this.serviceError))
  }

}
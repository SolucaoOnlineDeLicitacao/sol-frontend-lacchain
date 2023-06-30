import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { DashboardResponseDto } from "src/dtos/dashboard/dashboard-response.dto";

@Injectable()
export class DashbordService extends BaseService {

  private url = `${environment.api.path}/dashboard`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getData() {
    return this.httpClient
      .get<DashboardResponseDto>(`${this.url}`, this.authorizedHeader);
  }

}
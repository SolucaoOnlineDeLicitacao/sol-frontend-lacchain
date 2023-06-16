import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { Observable, catchError, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { acceptSupplierDto } from "src/dtos/contratos/acceptSupplier";
import { singAssociationDto } from "src/dtos/contratos/sing-association";



@Injectable({
  providedIn: 'root'
})
export class ContractsService extends BaseService {

  private url = `${environment.api.path}/contract`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }


  getContract(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/list`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  getContractById(_id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/get-by-id/` + _id, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  updateStatuss(_id: string, dto: acceptSupplierDto): Observable<any> {
    return this.httpClient
      .put(`${this.url}/update/${_id}`, dto)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
  updateStatus(_id: string, dto: acceptSupplierDto): Observable<any> {
    return this.httpClient
      .put(`${this.url}/update/${_id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
  singSupplier(_id: string, dto: singAssociationDto): Observable<any> {
    return this.httpClient
      .put(`${this.url}/sing-supplier/${_id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
  singAssociation(_id: string, dto: any): Observable<any> {
    return this.httpClient
      .put(`${this.url}/sing-association/${_id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
}
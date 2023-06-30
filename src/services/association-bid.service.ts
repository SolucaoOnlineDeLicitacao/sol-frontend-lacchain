import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";
import { AssociationBidRequestDto } from "src/dtos/association/association-bid.dto";
import { BidChangeStatusRequestDto } from "src/dtos/bid/bid-change-status-request.dto";
import { Observable, catchError, firstValueFrom, map } from "rxjs";

@Injectable()
export class AssociationBidService extends BaseService {
  private url = `${environment.api.path}/bid`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  bidRegister(dto: AssociationBidRequestDto) {
    return this.httpClient.post<AssociationBidRequestDto>(`${this.url}/register`, dto, this.authorizedHeader);
  }

  bidRegisterFormData(formData: FormData) {
    return this.httpClient.post<AssociationBidRequestDto>(`${this.url}/register`, formData, this.authorizedHeaderMulti);
  }

  list(): Observable<any> {
    return this.httpClient.get(`${this.url}/list`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }


  listForSupplier(): Observable<any> {
    return this.httpClient.get(`${this.url}/list-for-supplier`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }

  listForProposalSupplier(): Observable<any> {
    return this.httpClient.get(`${this.url}/list-for-proposal-supplier`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }

  getById(_id: string) {
    return this.httpClient.get(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
  }

  changeStatus(bidId: string, dto: BidChangeStatusRequestDto) {
    return this.httpClient.put(`${this.url}/change-status/${bidId}`, dto, this.authorizedHeader);
  }

  updateBid(bidId: string, dto: AssociationBidRequestDto) {
    return this.httpClient.put(`${this.url}/update/${bidId}`, dto, this.authorizedHeader);
  }

  download(id: string, type: string): any {
    // return this.httpClient
    //     .get(`${this.url}/download/${id}/${type}`, this.authorizedHeader)

    return this.httpClient.get(`${this.url}/download/${id}/${type}`, {
        headers: this.authorizedHeaderFile.headers,
        responseType: "blob",
      }).pipe(map(response => response), catchError(this.serviceError))
  }


  bidPdf(_id: string, type: string) {
    return firstValueFrom(this.httpClient
      .get(`${this.url}/bid-pdf/${_id}/${type}`, this.authorizedHeader)
      .pipe(map((response:any) => response))
    );
  }

  listByAssociation() {
    return this.httpClient.get(`${this.url}/list-by-association`, this.authorizedHeader);
  }
}

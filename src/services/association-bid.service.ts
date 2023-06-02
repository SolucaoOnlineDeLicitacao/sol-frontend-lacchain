import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { AssociationBidRequestDto } from 'src/dtos/association/association-bid.dto';
import { BidChangeStatusRequestDto } from 'src/dtos/bid/bid-change-status-request.dto';

@Injectable()
export class AssociationBidService extends BaseService {

    private url = `${environment.api.path}/bid`;

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    bidRegister(dto: AssociationBidRequestDto) {
        return this.httpClient
            .post<AssociationBidRequestDto>(`${this.url}/register`, dto, this.authorizedHeader);
    }

    list() {
        return this.httpClient
            .get(`${this.url}/list`, this.authorizedHeader)
    }

    getById(_id: string) {
        return this.httpClient
            .get(`${this.url}/get-by-id/${_id}`, this.authorizedHeader)
    }

    changeStatus(bidId: string, dto: BidChangeStatusRequestDto) {
        return this.httpClient
        .put(`${this.url}/change-status/${bidId}`, dto, this.authorizedHeader);
    }

}
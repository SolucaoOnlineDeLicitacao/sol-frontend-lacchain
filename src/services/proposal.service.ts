import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { ProposalGetResponseDto } from 'src/dtos/proposals/proposal-get-response.dto';
import { ProposalRefusedRegisterRequestDto } from 'src/dtos/proposals/proposal-refused-register-request.dto';

@Injectable({
    providedIn: 'root'
})
export class ProposalService extends BaseService {

    private url = `${environment.api.path}/proposal`;

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    register(dto: any): Observable<any> {
        return this.httpClient
            .post(`${this.url}/register`, dto, this.authorizedHeader)
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

    listProposalByBid(bidId: any): Observable<any[]> {
        return this.httpClient
            .get<ProposalGetResponseDto[]>(`${this.url}/list-proposal-in-bid/${bidId}`, this.authorizedHeader);
    }

    refusedProposal(proposalId: string, dto: ProposalRefusedRegisterRequestDto): Observable<any> {
            return this.httpClient
            .put(`${this.url}/refuse/${proposalId}`, dto, this.authorizedHeader);
    }

    acceptProposal(proposalId: string, dto: any): Observable<any> {
        return this.httpClient
            .put(`${this.url}/accept/${proposalId}`, dto, this.authorizedHeader)
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

    getProposalAcceptByBid(bidId: string): Observable<any> {
        return this.httpClient
            .get<ProposalGetResponseDto>(`${this.url}/get-proposal-accepted-bid/${bidId}`, this.authorizedHeader);
    }

}
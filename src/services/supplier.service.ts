import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class SupplierService extends BaseService {

    private url = `${environment.api.path}/supplier`;

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    getById(_id: string) {
        return this.httpClient
            .get(`${this.url}/get-by-id/${_id}`, this.authorizedHeader)
    }

    supplierList() {
        return this.httpClient
            .get(`${this.url}/list`, this.authorizedHeader)
    }

}

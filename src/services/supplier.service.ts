import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { SupplierRegisterDto } from '../dtos/supplier/supplier-register-request.dto';

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

    register(dto: SupplierRegisterDto) {
        return this.httpClient
            .post(`${this.url}/register`, dto, this.authorizedHeader);
    }

    deleteById(_id:string){
        return this.httpClient
        .delete(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
    }

    update(_id:string, dto: SupplierRegisterDto){
        return this.httpClient
        .put(`${this.url}/update/${_id}`, dto, this.authorizedHeader);
    }

}

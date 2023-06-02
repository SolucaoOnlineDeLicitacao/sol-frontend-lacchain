import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ConvenioRequestDto } from 'src/dtos/convenio/convenio-request.dto';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService extends BaseService {

  private url = `${environment.api.path}/convenios`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }
  getConvenio(): Observable<any> {
    return this.httpClient
      .get(`${this.url}`, this.authorizedHeader)
      .pipe(map(response => response), catchError(error => { console.log(error); return error; })
      );
  }

  register(dto: ConvenioRequestDto): Observable<ConvenioResponseDto> {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  updateConvenio(Id: string, dto: ConvenioRequestDto): Observable<ConvenioResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  deleteConvenio(Id: string): Observable<ConvenioRequestDto> {
    return this.httpClient
      .delete(`${this.url}/${Id}`, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

}

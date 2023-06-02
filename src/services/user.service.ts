import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserResetPasswordConfirmationRequestDto } from 'src/dtos/user/user-reset-password-confirmation-request.dto';
import { UserResetPasswordConfirmationResponseDto } from 'src/dtos/user/user-reset-password-confirmation-response.dto';
import { UserResetPasswordRequestDto } from 'src/dtos/user/user-reset-password-request.dto';
import { UserResetPasswordResponseDto } from 'src/dtos/user/user-reset-password-response.dto';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { UserRegisterRequestDto } from 'src/dtos/user/user-register-request.dto';

@Injectable()
export class UserService extends BaseService {

  deleteUser: UserListResponseDto | null = null;
  deleted: boolean = false;

  private url = `${environment.api.path}/user`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  resetPassword(dto: UserResetPasswordRequestDto) {
    return this.httpClient
      .post<UserResetPasswordResponseDto>(`${this.url}/reset-password`, dto, this.anonymousHeader);
  }

  firstAccess(dto: UserResetPasswordRequestDto) {
    return this.httpClient
      .post<UserResetPasswordResponseDto>(`${this.url}/first-access`, dto, this.anonymousHeader);
  }

  register(dto: UserRegisterRequestDto) {
    return this.httpClient
      .post<UserRegisterRequestDto>(`${this.url}/register`, dto, this.authorizedHeader);
  }

  resetPasswordConfirmation(dto: UserResetPasswordConfirmationRequestDto) {
    return this.httpClient
      .put<UserResetPasswordConfirmationResponseDto>(`${this.url}/reset-password-confirmation`, dto, this.anonymousHeader)
  }

  getById(_id: string) {
    return this.httpClient
      .get<UserListResponseDto>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader)
  }

  updateById(_id: string, dto: UserRegisterRequestDto) {
    return this.httpClient
      .put<UserListResponseDto>(`${this.url}/update-by-id/${_id}`, dto , this.authorizedHeader)
  }

  listByType(type: UserTypeEnum) {
    return this.httpClient
      .get<UserListResponseDto[]>(`${this.url}/list-by-type/${type}`, this.authorizedHeader)
  }

  delete(_id: string) {
    return this.httpClient
      .delete<UserListResponseDto>(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader)
  }

}

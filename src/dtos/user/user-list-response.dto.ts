import { UserStatusEnum } from "src/enums/user-status.enum";
import { UserTypeEnum } from "src/enums/user-type.enum";
import { AssociationResponseDto } from "../association/association-response.dto";

export abstract class UserListResponseDto {
    _id!: string;
    name!: string;
    email!: string;
    phone?: string;
    status!: UserStatusEnum;
    type!: UserTypeEnum;
    createdAt!: Date;
    document?: string;
    profilePicture?: string;
    office?: string;
    association?: AssociationResponseDto;
    supplier?: string;
    roles?: string;
    notification_list?: []
}
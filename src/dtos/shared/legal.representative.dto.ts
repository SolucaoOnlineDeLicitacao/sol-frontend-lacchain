import { AddressDto } from "./address.dto";
import { MaritalStatusEnum } from "./marital-status.enum";

export class LegalRepresentativeDto{
    name: string;
    nationality: string;
    maritalStatus: MaritalStatusEnum;
    cpf: string;
    rg: string;
    validityData: Date;
    address: AddressDto;
}
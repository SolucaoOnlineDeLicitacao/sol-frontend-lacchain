import { AssociationBidRequestDto } from "../association/association-bid.dto";

export abstract class ModelContractDto {
    _id: string;
    name!: string;
    bid!: AssociationBidRequestDto;
    createdAt: Date;
    contract: string;
}

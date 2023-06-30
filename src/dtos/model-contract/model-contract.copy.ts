import { AssociationBidRequestDto } from "../association/association-bid.dto";

export abstract class ModelContractDto {
    _id: string;
    name!: string;
    classification!: string;
    createdAt: Date;
    contract: string;
}

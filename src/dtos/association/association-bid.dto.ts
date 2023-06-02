import { AllotmentRequestDto } from "src/app/interface/licitacao.interface";

export abstract class AssociationBidRequestDto {
    description: string;
    status: string;
    agreement: string;
    classification: string;
    start_at: string;
    end_at: string;
    days_to_delivery: string;
    days_to_tiebreaker: string;
    local_to_delivery: string;
    bid_type: string;
    modality: string;
    aditional_site: string;
    add_allotment: AllotmentRequestDto[];
    invited_suppliers: string[];
}
import { AgreementStatusEnum } from "src/enums/agreement-status.enum";
import { AssociationResponseDto } from "../association/association-response.dto";
import { UserListResponseDto } from "../user/user-list-response.dto";
import { CostItemsResponseDto } from "../cost-items/cost-items-response.dto";

export abstract class ConvenioResponseDto {
  _id: string;
  register_number: string;
  register_object: string;
  status: AgreementStatusEnum;
  city: string;
  states: string;
  value: number;
  validity_date: Date;
  signature_date: Date;
  association: AssociationResponseDto;
  reviewer: UserListResponseDto;
  workPlan: WorkPlanInterface[];
}

export interface WorkPlanInterface {
  _id: string;
  name: string;
  product: Array<{ quantity: number; unitValue: number; costItems: CostItemsResponseDto; _id: string }>;
}

export interface WorkPlanDto {
  _id: string;
  name: string;
  product: Array<{ quantity: number; unitValue: number; costItems: string; _id: string }>;
}

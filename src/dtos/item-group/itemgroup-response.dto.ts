import { ItemsItemGroupResponseDto } from "./item-itemgroup-response.dto";

export abstract class ItemGroupResponseDto {
    name?: string;
    items?: {
        cost_item_id?: string;
        quantity?: string;
        estimated_cost?: string
    }
}
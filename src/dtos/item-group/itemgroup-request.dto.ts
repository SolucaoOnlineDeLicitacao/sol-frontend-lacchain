import { ItemsItemGroupRequestDto } from "./item-itemgroup-request.dto";

export abstract class ItemGroupRequestDto {
    name: string;
    items: {
        cost_item_id: string;
        quantity: string;
        estimated_cost: string
    }
}
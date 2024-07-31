﻿import { SaveRequest, SaveResponse, ServiceOptions, DeleteRequest, DeleteResponse, RetrieveRequest, RetrieveResponse, ListRequest, ListResponse, serviceRequest } from "@serenity-is/corelib";
import { OrdersRow } from "./OrdersRow";

export namespace OrdersService {
    export const baseUrl = 'Tables/Orders';

    export declare function Create(request: SaveRequest<OrdersRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<OrdersRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<OrdersRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<OrdersRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<OrdersRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<OrdersRow>>;

    export const Methods = {
        Create: "Tables/Orders/Create",
        Update: "Tables/Orders/Update",
        Delete: "Tables/Orders/Delete",
        Retrieve: "Tables/Orders/Retrieve",
        List: "Tables/Orders/List"
    } as const;

    [
        'Create', 
        'Update', 
        'Delete', 
        'Retrieve', 
        'List'
    ].forEach(x => {
        (<any>OrdersService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}
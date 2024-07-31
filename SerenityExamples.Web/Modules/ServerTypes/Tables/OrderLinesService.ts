import { SaveRequest, SaveResponse, ServiceOptions, DeleteRequest, DeleteResponse, RetrieveRequest, RetrieveResponse, ListRequest, ListResponse, serviceRequest } from "@serenity-is/corelib";
import { OrderLinesRow } from "./OrderLinesRow";

export namespace OrderLinesService {
    export const baseUrl = 'Tables/OrderLines';

    export declare function Create(request: SaveRequest<OrderLinesRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<OrderLinesRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<OrderLinesRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<OrderLinesRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<OrderLinesRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<OrderLinesRow>>;

    export const Methods = {
        Create: "Tables/OrderLines/Create",
        Update: "Tables/OrderLines/Update",
        Delete: "Tables/OrderLines/Delete",
        Retrieve: "Tables/OrderLines/Retrieve",
        List: "Tables/OrderLines/List"
    } as const;

    [
        'Create', 
        'Update', 
        'Delete', 
        'Retrieve', 
        'List'
    ].forEach(x => {
        (<any>OrderLinesService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}
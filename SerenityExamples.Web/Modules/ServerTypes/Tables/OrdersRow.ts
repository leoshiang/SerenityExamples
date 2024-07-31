import { fieldsProxy } from "@serenity-is/corelib";
import { OrderLinesRow } from "./OrderLinesRow";

export interface OrdersRow {
    CustomerNumber?: string;
    OrderDate?: string;
    OrderNumber?: string;
    SalesNumber?: string;
    Total?: number;
    Lines?: OrderLinesRow[];
}

export abstract class OrdersRow {
    static readonly idProperty = 'OrderNumber';
    static readonly nameProperty = 'OrderNumber';
    static readonly localTextPrefix = 'Tables.Orders';
    static readonly deletePermission = '訂單主檔:修改';
    static readonly insertPermission = '訂單主檔:新增';
    static readonly readPermission = '訂單主檔:讀取';
    static readonly updatePermission = '訂單主檔:修改';

    static readonly Fields = fieldsProxy<OrdersRow>();
}
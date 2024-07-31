import { fieldsProxy } from "@serenity-is/corelib";

export interface OrderLinesRow {
    FakeId?: string;
    ItemNumber?: number;
    OrderNumber?: string;
    Price?: number;
    ProductNumber?: string;
    Qty?: number;
    Total?: number;
}

export abstract class OrderLinesRow {
    static readonly idProperty = 'FakeId';
    static readonly nameProperty = 'OrderNumber';
    static readonly localTextPrefix = 'Tables.OrderLines';
    static readonly deletePermission = '訂單明細檔:修改';
    static readonly insertPermission = '訂單明細檔:新增';
    static readonly readPermission = '訂單明細檔:讀取';
    static readonly updatePermission = '訂單明細檔:修改';

    static readonly Fields = fieldsProxy<OrderLinesRow>();
}
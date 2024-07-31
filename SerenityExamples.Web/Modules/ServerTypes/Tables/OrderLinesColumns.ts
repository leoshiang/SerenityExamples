import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { OrderLinesRow } from "./OrderLinesRow";

export interface OrderLinesColumns {
    OrderNumber: Column<OrderLinesRow>;
    ItemNumber: Column<OrderLinesRow>;
    ProductNumber: Column<OrderLinesRow>;
    Qty: Column<OrderLinesRow>;
    Price: Column<OrderLinesRow>;
    Total: Column<OrderLinesRow>;
}

export class OrderLinesColumns extends ColumnsBase<OrderLinesRow> {
    static readonly columnsKey = 'Tables.OrderLines';
    static readonly Fields = fieldsProxy<OrderLinesColumns>();
}
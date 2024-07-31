import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { OrdersRow } from "./OrdersRow";

export interface OrdersColumns {
    OrderDate: Column<OrdersRow>;
    OrderNumber: Column<OrdersRow>;
    CustomerNumber: Column<OrdersRow>;
    SalesNumber: Column<OrdersRow>;
    Total: Column<OrdersRow>;
}

export class OrdersColumns extends ColumnsBase<OrdersRow> {
    static readonly columnsKey = 'Tables.Orders';
    static readonly Fields = fieldsProxy<OrdersColumns>();
}
import { OrderLinesEditor } from "@/Tables/OrderLines/OrderLinesEditor";
import { DateEditor, StringEditor, IntegerEditor, PrefixedContext, initFormType } from "@serenity-is/corelib";

export interface OrdersForm {
    OrderDate: DateEditor;
    OrderNumber: StringEditor;
    CustomerNumber: StringEditor;
    SalesNumber: StringEditor;
    Total: IntegerEditor;
    Lines: OrderLinesEditor;
}

export class OrdersForm extends PrefixedContext {
    static readonly formKey = 'Tables.Orders';
    private static init: boolean;

    constructor(prefix: string) {
        super(prefix);

        if (!OrdersForm.init)  {
            OrdersForm.init = true;

            var w0 = DateEditor;
            var w1 = StringEditor;
            var w2 = IntegerEditor;
            var w3 = OrderLinesEditor;

            initFormType(OrdersForm, [
                'OrderDate', w0,
                'OrderNumber', w1,
                'CustomerNumber', w1,
                'SalesNumber', w1,
                'Total', w2,
                'Lines', w3
            ]);
        }
    }
}
import { StringEditor, IntegerEditor, PrefixedContext, initFormType } from "@serenity-is/corelib";

export interface OrderLinesForm {
    OrderNumber: StringEditor;
    ItemNumber: IntegerEditor;
    ProductNumber: StringEditor;
    Qty: IntegerEditor;
    Price: IntegerEditor;
    Total: IntegerEditor;
}

export class OrderLinesForm extends PrefixedContext {
    static readonly formKey = 'Tables.OrderLines';
    private static init: boolean;

    constructor(prefix: string) {
        super(prefix);

        if (!OrderLinesForm.init)  {
            OrderLinesForm.init = true;

            var w0 = StringEditor;
            var w1 = IntegerEditor;

            initFormType(OrderLinesForm, [
                'OrderNumber', w0,
                'ItemNumber', w1,
                'ProductNumber', w0,
                'Qty', w1,
                'Price', w1,
                'Total', w1
            ]);
        }
    }
}
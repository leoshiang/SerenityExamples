import {Decorators} from "@serenity-is/corelib";
import {GridEditorBase} from "@serenity-is/extensions";
import {OrderLinesDialog} from "./OrderLinesDialog";
import {OrderLinesRow} from "@/ServerTypes/Tables/OrderLinesRow";
import {OrderLinesColumns} from "@/ServerTypes/Tables/OrderLinesColumns";

@Decorators.registerEditor('SerenityExamples.Tables.OrderLinesEditor')
export class OrderLinesEditor<P = {}> extends GridEditorBase<OrderLinesRow, P> {
    protected getColumnsKey() {
        return OrderLinesColumns.columnsKey;
    }

    protected getDialogType() {
        return OrderLinesDialog;
    }

    protected getLocalTextPrefix() {
        return OrderLinesRow.localTextPrefix;
    }
}

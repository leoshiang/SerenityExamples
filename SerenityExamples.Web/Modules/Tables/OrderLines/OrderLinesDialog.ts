import {OrderLinesForm, OrderLinesRow, OrderLinesService} from '@/ServerTypes/Tables';
import {Decorators} from '@serenity-is/corelib';
import {GridEditorDialog} from "@serenity-is/extensions";

@Decorators.registerClass('SerenityExamples.Tables.OrderLinesDialog')
@Decorators.panel()
export class OrderLinesDialog extends GridEditorDialog<OrderLinesRow, any> {
    protected getFormKey() { return OrderLinesForm.formKey; }
    protected getRowDefinition() { return OrderLinesRow; }
    protected getService() { return OrderLinesService.baseUrl; }

    protected form = new OrderLinesForm(this.idPrefix);
}
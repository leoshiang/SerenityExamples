import {OrdersForm, OrdersRow, OrdersService} from '@/ServerTypes/Tables';
import {Decorators, EntityDialog} from '@serenity-is/corelib';

@Decorators.registerClass('SerenityExamples.Tables.OrdersDialog')
@Decorators.panel()
export class OrdersDialog extends EntityDialog<OrdersRow, any> {
    protected getFormKey() { return OrdersForm.formKey; }
    protected getRowDefinition() { return OrdersRow; }
    protected getService() { return OrdersService.baseUrl; }

    protected form = new OrdersForm(this.idPrefix);
}
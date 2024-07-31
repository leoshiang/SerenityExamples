import {OrdersColumns, OrdersRow, OrdersService} from '@/ServerTypes/Tables';
import {Decorators, EntityGrid} from '@serenity-is/corelib';
import {OrdersDialog} from './OrdersDialog';
import {AutoColumnWidthMixin} from "@serenity-is/pro.extensions";

@Decorators.registerClass('SerenityExamples.Tables.OrdersGrid')
export class OrdersGrid extends EntityGrid<OrdersRow> {
    protected getColumnsKey() { return OrdersColumns.columnsKey; }
    protected getDialogType() { return OrdersDialog; }
    protected getRowDefinition() { return OrdersRow; }
    protected getService() { return OrdersService.baseUrl; }

    protected createSlickGrid() {
        this.slickGrid = super.createSlickGrid();

        new AutoColumnWidthMixin({
            grid: this
        });

        return this.slickGrid;
    }
}
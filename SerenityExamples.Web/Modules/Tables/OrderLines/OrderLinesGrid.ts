import {OrderLinesColumns, OrderLinesRow, OrderLinesService} from '@/ServerTypes/Tables';
import {Decorators, EntityGrid} from '@serenity-is/corelib';
import {OrderLinesDialog} from './OrderLinesDialog';
import {AutoColumnWidthMixin} from "@serenity-is/pro.extensions";

@Decorators.registerClass('SerenityExamples.Tables.OrderLinesGrid')
export class OrderLinesGrid extends EntityGrid<OrderLinesRow> {
    protected getColumnsKey() { return OrderLinesColumns.columnsKey; }
    protected getDialogType() { return OrderLinesDialog; }
    protected getRowDefinition() { return OrderLinesRow; }
    protected getService() { return OrderLinesService.baseUrl; }

    protected createSlickGrid() {
        this.slickGrid = super.createSlickGrid();

        new AutoColumnWidthMixin({
            grid: this
        });
        
        return this.slickGrid;
    }
}
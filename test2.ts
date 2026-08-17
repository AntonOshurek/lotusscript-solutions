import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  GridOptions,
  ICellRendererParams,
} from 'ag-grid-community';

@Component({
  selector: 'app-to-approve-detail',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './to-approve-detail.component.html',
  styleUrl: './to-approve-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToApproveDetailComponent {
  params!: ICellRendererParams;

  readonly detailGridOptions: GridOptions = {
    columnDefs: [
      { field: 'field' },
      { field: 'currentValue' },
      { field: 'newValue' },
    ],
  };

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
}




<div class="detail">
  <div class="detail__actions">
    <button type="button">Action 1</button>
    <button type="button">Action 2</button>
    <button type="button">Action 3</button>
  </div>

  <ag-grid-angular
    class="detail__grid"
    [gridOptions]="detailGridOptions"
    [rowData]="params.data?.changes ?? []"
  />
</div>





      :host {
  display: block;
  height: 100%;
}

.detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 24px 24px;
  box-sizing: border-box;
}

.detail__actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.detail__grid {
  flex: 1;
  min-height: 0;
}

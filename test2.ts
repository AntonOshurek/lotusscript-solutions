// widgets/to-approve/model/to-approve.model.ts

import type {
  RowEdit,
  RowEditLiveRow,
  RowEditValue,
} from '@entities/row-edit';

import type { GovernanceCase } from '@entities/governance';

export interface ToApproveDocument {
  case: GovernanceCase;

  rowEditId: number;
  targetCode: string;

  document: RowEdit;
  live?: RowEditLiveRow;

  changes: ToApproveChange[];
}

export interface ToApproveChange {
  field: string;
  currentValue: RowEditValue | undefined;
  proposedValue: RowEditValue;
}






// widgets/to-approve/model/to-approve.mapper.ts

import type {
  RowEdit,
  RowEditLiveRow,
} from '@entities/row-edit';

import type {
  GovernanceCase,
} from '@entities/governance';

import type {
  RowEditLiveItem,
  RowEditViewItem,
} from '@entities/row-edit';

import type {
  ToApproveChange,
  ToApproveDocument,
} from './to-approve.model';

function mapChanges(
  document: RowEdit,
  live?: RowEditLiveRow,
): ToApproveChange[] {
  return Object.entries(document.newValues).map(
    ([field, proposedValue]) => ({
      field,
      currentValue: live?.liveValues[field],
      proposedValue,
    }),
  );
}

export function mapToApproveDocuments(
  cases: GovernanceCase[],
  views: RowEditViewItem[],
  liveItems: RowEditLiveItem[],
): ToApproveDocument[] {
  const casesByRowEditId = new Map(
    cases.map(item => [item.intentRefId, item]),
  );

  const liveByRowEditId = new Map(
    liveItems
      .filter(item => item.status === 'OK')
      .map(item => [item.rowEditId, item.live]),
  );

  return views
    .filter(item => item.status === 'OK')
    .flatMap(item => {
      const governanceCase =
        casesByRowEditId.get(item.rowEditId);

      if (!governanceCase) {
        return [];
      }

      const live =
        liveByRowEditId.get(item.rowEditId);

      return item.rowEdit.rows.map(document => {
        const liveRow = live?.rows.find(
          row => row.pkValue === document.pkValue,
        );

        return {
          case: governanceCase,
          rowEditId: item.rowEditId,
          targetCode: item.rowEdit.targetCode,
          document,
          live: liveRow,
          changes: mapChanges(document, liveRow),
        };
      });
    });
}






readonly rowData = signal<ToApproveDocument[]>([]);

ngOnInit(): void {
  this.loadData();
}

private loadData(): void {
  this.governanceQueriesApi
    .getCases(
      {
        limit: 25,
      },
      'INBOX',
      'IN_FLIGHT',
    )
    .pipe(
      switchMap(casesResponse => {
        const cases = casesResponse.data.filter(
          item => item.intentKind === 'rowedit',
        );

        const rowEditIds = cases.map(
          item => item.intentRefId,
        );

        if (rowEditIds.length === 0) {
          return of([]);
        }

        const request = {
          rowEditIds,
        };

        return forkJoin({
          views:
            this.rowEditQueriesApi.getRowEditsByIds(
              request,
            ),

          live:
            this.rowEditQueriesApi.getRowEditsLive(
              request,
            ),
        }).pipe(
          map(({ views, live }) =>
            mapToApproveDocuments(
              cases,
              views.data,
              live.data,
            ),
          ),
        );
      }),
    )
    .subscribe({
      next: documents => {
        this.rowData.set(documents);
      },
      error: error => {
        console.error(
          'Failed to load documents',
          error,
        );

        this.rowData.set([]);
      },
    });
}








// widgets/to-approve/model/to-approve-grid.config.ts

import type {
  ColDef,
  GridOptions,
} from 'ag-grid-community';

import type {
  ToApproveDocument,
} from './to-approve.model';

export const TO_APPROVE_COLUMN_DEFS:
  ColDef<ToApproveDocument>[] = [
    {
      headerName: 'Document',
      valueGetter: params =>
        params.data?.document.pkValue ?? '',
      cellRenderer: 'agGroupCellRenderer',
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Target',
      field: 'targetCode',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Changes',
      valueGetter: params =>
        params.data?.changes.length ?? 0,
      width: 110,
    },
    {
      headerName: 'Status',
      valueGetter: params =>
        params.data?.live?.liveStatus ?? 'UNKNOWN',
      flex: 1,
      minWidth: 190,
    },
  ];







import type {
  IDetailCellRendererParams,
} from 'ag-grid-enterprise';

import type {
  ToApproveChange,
  ToApproveDocument,
} from './to-approve.model';

export const TO_APPROVE_DETAIL_PARAMS:
  IDetailCellRendererParams<
    ToApproveDocument,
    ToApproveChange
  > = {
    detailGridOptions: {
      columnDefs: [
        {
          headerName: 'Field',
          field: 'field',
          flex: 1,
          minWidth: 180,
        },
        {
          headerName: 'Current',
          field: 'currentValue',
          flex: 1,
          minWidth: 180,
          valueFormatter: params =>
            formatGridValue(params.value),
        },
        {
          headerName: 'Proposed',
          field: 'proposedValue',
          flex: 1,
          minWidth: 180,
          valueFormatter: params =>
            formatGridValue(params.value),
        },
      ],

      defaultColDef: {
        sortable: false,
        filter: false,
        resizable: true,
      },
    },

    getDetailRowData: params => {
      params.successCallback(
        params.data.changes,
      );
    },
  };




import type {
  RowEditValue,
} from '@entities/row-edit';

function formatGridValue(
  value: RowEditValue | undefined,
): string {
  if (value === undefined) {
    return '—';
  }

  if (value === null) {
    return 'NULL';
  }

  return String(value);
}










@Component({
  selector: 'app-to-approve-widget',
  imports: [AgGridAngular],
  templateUrl: './ui/to-approve.widget.html',
  styleUrl: './ui/styles/to-approve.widget.css',
})
export class ToApproveWidget implements OnInit {
  private readonly rowEditQueriesApi =
    inject(RowEditQueriesApi);

  private readonly governanceQueriesApi =
    inject(GovernanceQueriesApi);

  readonly rowData =
    signal<ToApproveDocument[]>([]);

  readonly columnDefs =
    TO_APPROVE_COLUMN_DEFS;

  readonly detailCellRendererParams =
    TO_APPROVE_DETAIL_PARAMS;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // pipeline из примера выше
  }
}






<ag-grid-angular
  [rowData]="rowData()"
  [columnDefs]="columnDefs"
  [masterDetail]="true"
  [detailCellRendererParams]="detailCellRendererParams"
  [detailRowAutoHeight]="true"
/>

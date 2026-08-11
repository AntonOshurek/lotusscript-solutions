import type {
  ColDef,
  GridOptions,
  IDetailCellRendererParams,
} from 'ag-grid-community';

// ENTITIES
import type { RowEditValue } from '@entities/row-edit';

// MODEL
import type {
  ToApproveChange,
  ToApproveDocument,
} from './to-approve.model';

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

/**
 * MAIN GRID
 *
 * Одна строка = один документ.
 */
export const TO_APPROVE_COLUMN_DEFS: ColDef<ToApproveDocument>[] = [
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
    minWidth: 160,
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
    minWidth: 200,
  },
];

export const TO_APPROVE_GRID_OPTIONS:
  GridOptions<ToApproveDocument> = {
    columnDefs: TO_APPROVE_COLUMN_DEFS,

    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },

    masterDetail: true,

    getRowId: params =>
      `${params.data.rowEditId}-${params.data.document.pkValue}`,
  };

/**
 * DETAIL GRID
 *
 * Строки:
 * Field | Current | Proposed
 */
const TO_APPROVE_DETAIL_COLUMN_DEFS:
  ColDef<ToApproveChange>[] = [
    {
      headerName: 'Field',
      field: 'field',
      flex: 1,
      minWidth: 200,
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
  ];

const TO_APPROVE_DETAIL_GRID_OPTIONS:
  GridOptions<ToApproveChange> = {
    columnDefs: TO_APPROVE_DETAIL_COLUMN_DEFS,

    defaultColDef: {
      sortable: false,
      filter: false,
      resizable: true,
    },

    getRowId: params => params.data.field,
  };

/**
 * MASTER / DETAIL CONFIG
 *
 * Берём только те свойства IDetailCellRendererParams,
 * которые реально задаём сами.
 *
 * Благодаря satisfies остаётся полная типизация:
 * - params.data
 * - params.successCallback
 * - detailGridOptions
 * - params в valueFormatter колонок
 */
export const TO_APPROVE_DETAIL_PARAMS = {
  detailGridOptions: TO_APPROVE_DETAIL_GRID_OPTIONS,

  getDetailRowData: params => {
    params.successCallback(params.data.changes);
  },
} satisfies Pick<
  IDetailCellRendererParams<
    ToApproveDocument,
    ToApproveChange
  >,
  'detailGridOptions' | 'getDetailRowData'
>;

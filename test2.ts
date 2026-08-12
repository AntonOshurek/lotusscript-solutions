import type {
  ColDef,
  GridOptions,
  IDetailCellRendererParams,
} from 'ag-grid-community';

// SHARED
import {
  defaultColDef,
  defaultGridOptions,
  defaultSideBar,
  defaultToolbar,
} from '@shared/ui/ag-grid/ag-grid-table.config';

// ENTITIES
import type { RowEditValue } from '@entities/row-edit';

// MODEL
import type {
  ToApproveChange,
  ToApproveDocument,
} from './to-approve.model';

const formatGridValue = (
  value: RowEditValue | undefined,
): string => {
  if (value === undefined) {
    return '—';
  }

  if (value === null) {
    return 'NULL';
  }

  return String(value);
};

const colDefs: ColDef<ToApproveDocument>[] = [
  {
    headerName: 'Document',
    valueGetter: params =>
      params.data?.document.pkValue ?? '',
    cellRenderer: 'agGroupCellRenderer',
    minWidth: 180,
    flex: 1,
  },
  {
    headerName: 'Target',
    field: 'targetCode',
    minWidth: 160,
    flex: 1,
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
    minWidth: 200,
    flex: 1,
  },
];

const gridOptions: Partial<GridOptions<ToApproveDocument>> = {
  ...defaultGridOptions,

  masterDetail: true,

  getRowId: params =>
    `${params.data.rowEditId}-${params.data.document.pkValue}`,
};

const detailColDefs: ColDef<ToApproveChange>[] = [
  {
    headerName: 'Field',
    field: 'field',
    minWidth: 200,
    flex: 1,
  },
  {
    headerName: 'Current',
    field: 'currentValue',
    minWidth: 180,
    flex: 1,
    valueFormatter: params =>
      formatGridValue(params.value),
  },
  {
    headerName: 'Proposed',
    field: 'proposedValue',
    minWidth: 180,
    flex: 1,
    valueFormatter: params =>
      formatGridValue(params.value),
  },
];

const detailGridOptions: GridOptions<ToApproveChange> = {
  ...defaultGridOptions,

  columnDefs: detailColDefs,

  defaultColDef: {
    ...defaultColDef,
    sortable: false,
    filter: false,
  },

  getRowId: params => params.data.field,
};

const detailCellRendererParams = {
  detailGridOptions,

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

const agGridConfig = {
  colDefs,
  defaultColDef,
  sideBar: defaultSideBar,
  gridOptions,
  toolbar: defaultToolbar,
  detailCellRendererParams,
};

export { agGridConfig };

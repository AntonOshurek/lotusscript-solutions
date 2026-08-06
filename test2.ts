import type {
  ColDef,
  ValueParserParams,
} from 'ag-grid-community';

import type { RowEditTargetMetadata } from '@entities/row-edit';

type RowEditColumnMetadata =
  RowEditTargetMetadata['columns'][number];

type BooleanRegistryValue = 'Y' | 'N';

const normalizeColumnName = (name: string): string =>
  name.trim().toLowerCase();

function isEmptyValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    String(value).trim() === ''
  );
}

function parseNumberValue<TData>(
  params: ValueParserParams<TData>,
): number | null | unknown {
  if (isEmptyValue(params.newValue)) {
    return null;
  }

  const parsedValue = Number(params.newValue);

  if (!Number.isFinite(parsedValue)) {
    return params.oldValue;
  }

  return parsedValue;
}

function parseStringValue<TData>(
  params: ValueParserParams<TData>,
): string | null {
  if (isEmptyValue(params.newValue)) {
    return null;
  }

  return String(params.newValue).trim();
}

function parseClobValue<TData>(
  params: ValueParserParams<TData>,
): string | null {
  if (
    params.newValue === null ||
    params.newValue === undefined ||
    params.newValue === ''
  ) {
    return null;
  }

  /*
   * Для CLOB не используем trim(), чтобы сохранить
   * переносы строк и пробелы большого текста.
   */
  return String(params.newValue);
}

function parseDateValue<TData>(
  params: ValueParserParams<TData>,
): string | null | unknown {
  if (isEmptyValue(params.newValue)) {
    return null;
  }

  const value = String(params.newValue).trim();

  /*
   * agDateStringCellEditor возвращает дату
   * в формате YYYY-MM-DD.
   */
  const isValidDateFormat =
    /^\d{4}-\d{2}-\d{2}$/.test(value);

  if (!isValidDateFormat) {
    return params.oldValue;
  }

  const [year, month, day] = value
    .split('-')
    .map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isRealDate
    ? value
    : params.oldValue;
}

function parseBooleanValue<TData>(
  params: ValueParserParams<TData>,
): BooleanRegistryValue | null | unknown {
  if (isEmptyValue(params.newValue)) {
    return null;
  }

  if (
    params.newValue === 'Y' ||
    params.newValue === 'N'
  ) {
    return params.newValue;
  }

  return params.oldValue;
}

function getEditableColumnConfig<TData>(
  metadata: RowEditColumnMetadata,
): Partial<ColDef<TData>> {
  switch (metadata.kind) {
    case 'NUMBER':
      return {
        cellEditor: 'agNumberCellEditor',
        valueParser: parseNumberValue,
      };

    case 'STRING':
      return {
        cellEditor: 'agTextCellEditor',
        valueParser: parseStringValue,
      };

    case 'CLOB':
      return {
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
          rows: 10,
          cols: 60,
          maxLength: 100_000,
        },
        valueParser: parseClobValue,
      };

    case 'DATE':
    case 'TIMESTAMP':
      return {
        cellEditor: 'agDateStringCellEditor',
        valueParser: parseDateValue,
      };

    case 'BOOL':
      return {
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Y', 'N'] satisfies BooleanRegistryValue[],
        },
        valueParser: parseBooleanValue,
      };
  }
}

export function applyRowEditMetadata<TData>(
  colDefs: ColDef<TData>[] | undefined,
  metadata: RowEditTargetMetadata | null,
): ColDef<TData>[] | undefined {
  if (!metadata) {
    return colDefs;
  }

  const metadataByName = new Map(
    metadata.columns.map(column => [
      normalizeColumnName(column.name),
      column,
    ]),
  );

  return colDefs?.map(colDef => {
    const fieldName = colDef.field;

    if (!fieldName) {
      return colDef;
    }

    const columnMetadata = metadataByName.get(
      normalizeColumnName(fieldName),
    );

    /*
     * Если колонки нет в metadata, ничего не добавляем.
     * AG Grid оставит editable === false по умолчанию.
     */
    if (!columnMetadata) {
      return colDef;
    }

    if (columnMetadata.usage !== 'EDITABLE') {
      return {
        ...colDef,
        editable: false,
      };
    }

    return {
      ...colDef,
      editable: true,
      ...getEditableColumnConfig<TData>(
        columnMetadata,
      ),
    };
  });
}

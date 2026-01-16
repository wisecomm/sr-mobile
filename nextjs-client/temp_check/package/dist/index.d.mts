import { ColumnPinningState, SortingState, RowSelectionState, PaginationState, VisibilityState, Table, ColumnDef } from '@tanstack/table-core';
export { Cell, ColumnDef, ColumnPinningState, Header, HeaderGroup, PaginationState, Row, RowSelectionState, SortingState, Table, VisibilityState } from '@tanstack/table-core';

interface SOGridOptions<TData> {
    rowData: TData[];
    columnDefs: SOColumnDef<TData>[];
    sortable?: boolean;
    multiSort?: boolean;
    defaultSortModel?: SortModel[];
    filterable?: boolean;
    quickFilterText?: string;
    rowSelection?: 'single' | 'multiple' | false;
    onSelectionChanged?: (selectedRows: TData[]) => void;
    pagination?: boolean;
    paginationPageSize?: number;
    paginationPageSizeOptions?: number[];
    /** 페이지 변경 시 스크롤 위치 유지 (AG-Grid: suppressScrollOnNewData) */
    suppressScrollOnNewData?: boolean;
    /** 컨테이너 높이에 맞춰 페이지 크기 자동 계산 (AG-Grid: paginationAutoPageSize) */
    paginationAutoPageSize?: boolean;
    serverSide?: boolean;
    totalRows?: number;
    loading?: boolean;
    onPaginationChange?: (params: PaginationChangeParams) => void;
    onSortChange?: (sortModel: SortModel[]) => void;
    onFilterChange?: (filterModel: FilterModel) => void;
    defaultColDef?: Partial<SOColumnDef<TData>>;
    columnPinning?: ColumnPinningState;
    rowHeight?: number;
    headerHeight?: number;
    theme?: 'default' | 'dark' | 'compact';
    onRowClicked?: (event: RowClickedEvent<TData>) => void;
    onRowDoubleClicked?: (event: RowClickedEvent<TData>) => void;
    onCellClicked?: (event: CellClickedEvent<TData>) => void;
    onCellValueChanged?: (event: CellValueChangedEvent<TData>) => void;
    onGridReady?: (api: SOGridApi<TData>) => void;
    virtualizeRows?: boolean;
    overscanCount?: number;
}
interface SOColumnDef<TData> {
    field?: keyof TData | string;
    headerName?: string;
    colId?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    flex?: number;
    sortable?: boolean;
    filterable?: boolean;
    resizable?: boolean;
    pinned?: 'left' | 'right' | false;
    hide?: boolean;
    lockVisible?: boolean;
    cellRenderer?: CellRenderer<TData>;
    headerRenderer?: HeaderRenderer<TData>;
    valueFormatter?: ValueFormatter<TData>;
    valueGetter?: ValueGetter<TData>;
    editable?: boolean;
    cellEditor?: CellEditor<TData>;
    cellEditorParams?: any;
    checkboxSelection?: boolean;
    cellClass?: string | ((params: CellClassParams<TData>) => string);
    cellStyle?: Record<string, any> | ((params: CellClassParams<TData>) => Record<string, any>);
    headerClass?: string;
    headerStyle?: Record<string, any>;
    children?: SOColumnDef<TData>[];
}
type CellRenderer<TData> = (params: CellRendererParams<TData>) => any;
type HeaderRenderer<TData> = (params: HeaderRendererParams<TData>) => any;
type ValueFormatter<TData> = (params: ValueFormatterParams<TData>) => string;
type ValueGetter<TData> = (params: ValueGetterParams<TData>) => any;
type CellEditor<TData> = string | ((params: CellEditorParams<TData>) => any);
interface CellRendererParams<TData> {
    value: any;
    data: TData;
    rowIndex: number;
    colDef: SOColumnDef<TData>;
    api: SOGridApi<TData>;
}
interface HeaderRendererParams<TData> {
    colDef: SOColumnDef<TData>;
    api: SOGridApi<TData>;
}
interface ValueFormatterParams<TData> {
    value: any;
    data: TData;
    colDef: SOColumnDef<TData>;
}
interface ValueGetterParams<TData> {
    data: TData;
    colDef: SOColumnDef<TData>;
}
interface CellEditorParams<TData> {
    value: any;
    data: TData;
    rowIndex: number;
    colDef: SOColumnDef<TData>;
    onValueChange: (newValue: any) => void;
    stopEditing: () => void;
    api: SOGridApi<TData>;
}
interface CellClassParams<TData> {
    value: any;
    data: TData;
    rowIndex: number;
    colDef: SOColumnDef<TData>;
}
interface RowClickedEvent<TData> {
    data: TData;
    rowIndex: number;
    event: MouseEvent;
}
interface CellClickedEvent<TData> {
    value: any;
    data: TData;
    rowIndex: number;
    colDef: SOColumnDef<TData>;
    event: MouseEvent;
}
interface CellValueChangedEvent<TData> {
    value: any;
    oldValue: any;
    data: TData;
    rowIndex: number;
    colDef: SOColumnDef<TData>;
    api: SOGridApi<TData>;
}
interface SortModel {
    colId: string;
    sort: 'asc' | 'desc';
}
interface PaginationChangeParams {
    page: number;
    pageSize: number;
    startRow: number;
    endRow: number;
}
interface FilterModel {
    [colId: string]: FilterCondition;
}
interface FilterCondition {
    filterType: 'text' | 'number' | 'date' | 'set';
    type?: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
    filter?: string | number;
    filterTo?: string | number;
    values?: any[];
}
interface ServerSideRequest {
    startRow: number;
    endRow: number;
    sortModel: SortModel[];
    filterModel: FilterModel;
}
interface ServerSideResponse<TData> {
    rowData: TData[];
    totalRows: number;
}
interface SOGridApi<TData> {
    setRowData: (rowData: TData[]) => void;
    getRowData: () => TData[];
    getDisplayedRowCount: () => number;
    getSelectedRows: () => TData[];
    selectAll: () => void;
    deselectAll: () => void;
    selectRow: (rowIndex: number) => void;
    deselectRow: (rowIndex: number) => void;
    setSortModel: (sortModel: SortModel[]) => void;
    getSortModel: () => SortModel[];
    setQuickFilter: (filterText: string) => void;
    resetFilters: () => void;
    setPage: (page: number) => void;
    getPage: () => number;
    getTotalPages: () => number;
    setPageSize: (size: number) => void;
    setColumnVisible: (colId: string, visible: boolean) => void;
    setColumnPinned: (colId: string, pinned: 'left' | 'right' | false) => void;
    getColumnState: () => ColumnState[];
    setColumnState: (state: ColumnState[]) => void;
    refreshCells: () => void;
    sizeColumnsToFit: () => void;
    exportDataAsCsv: (params?: ExportParams) => void;
}
interface ColumnState {
    colId: string;
    width?: number;
    hide?: boolean;
    pinned?: 'left' | 'right' | false;
    sort?: 'asc' | 'desc' | null;
    sortIndex?: number;
}
interface ExportParams {
    fileName?: string;
    columnKeys?: string[];
    onlySelected?: boolean;
}
interface GridState {
    sorting: SortingState;
    rowSelection: RowSelectionState;
    pagination: PaginationState;
    columnPinning: ColumnPinningState;
    columnVisibility: VisibilityState;
    globalFilter: string;
}

/**
 * SO-Grid 코어 클래스
 * TanStack Table을 래핑하여 AG-Grid 스타일 API 제공
 */
declare class SOGridCore<TData> {
    private table;
    private options;
    private state;
    private listeners;
    constructor(options: SOGridOptions<TData>);
    private initializeState;
    private getInitialVisibility;
    private createTableInstance;
    private notifyListeners;
    /**
     * 상태 변경 리스너 등록
     */
    subscribe(listener: () => void): () => void;
    /**
     * TanStack Table 인스턴스 반환
     */
    getTable(): Table<TData>;
    /**
     * 현재 상태 반환
     */
    getState(): GridState;
    /**
     * 옵션 반환
     */
    getOptions(): SOGridOptions<TData>;
    /**
     * 선택된 행 반환
     */
    getSelectedRows(): TData[];
    /**
     * API 객체 생성
     */
    createApi(): SOGridApi<TData>;
}
/**
 * SO-Grid 코어 인스턴스 생성
 */
declare function createSOGrid<TData>(options: SOGridOptions<TData>): SOGridCore<TData>;

/**
 * SO-Grid 컬럼 정의를 TanStack Table 컬럼 정의로 변환
 */
declare function mapColumnDefs<TData>(soColumns: SOColumnDef<TData>[], defaultColDef?: Partial<SOColumnDef<TData>>): ColumnDef<TData, unknown>[];
/**
 * 컬럼 ID 추출
 */
declare function getColumnId<TData>(colDef: SOColumnDef<TData>): string;
/**
 * 플랫 컬럼 리스트로 변환 (그룹 해제)
 */
declare function flattenColumns<TData>(columns: SOColumnDef<TData>[]): SOColumnDef<TData>[];

/**
 * 값이 null 또는 undefined인지 확인
 */
declare function isNil(value: unknown): value is null | undefined;
/**
 * 깊은 병합
 */
declare function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T;
/**
 * 객체인지 확인
 */
declare function isObject(value: unknown): value is Record<string, unknown>;
/**
 * 배열인지 확인
 */
declare function isArray(value: unknown): value is unknown[];
/**
 * 고유 ID 생성
 */
declare function generateId(prefix?: string): string;
/**
 * 디바운스 함수
 */
declare function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void;
/**
 * 쓰로틀 함수
 */
declare function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void;
/**
 * 클래스명 조합
 */
declare function classNames(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string;

export { type CellClassParams, type CellClickedEvent, type CellEditor, type CellEditorParams, type CellRenderer, type CellRendererParams, type CellValueChangedEvent, type ColumnState, type ExportParams, type FilterCondition, type FilterModel, type GridState, type HeaderRenderer, type HeaderRendererParams, type PaginationChangeParams, type RowClickedEvent, type SOColumnDef, type SOGridApi, SOGridCore, type SOGridOptions, type ServerSideRequest, type ServerSideResponse, type SortModel, type ValueFormatter, type ValueFormatterParams, type ValueGetter, type ValueGetterParams, classNames, createSOGrid, debounce, deepMerge, flattenColumns, generateId, getColumnId, isArray, isNil, isObject, mapColumnDefs, throttle };

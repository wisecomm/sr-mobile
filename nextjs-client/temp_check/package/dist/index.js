"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  SOGridCore: () => SOGridCore,
  classNames: () => classNames,
  createSOGrid: () => createSOGrid,
  debounce: () => debounce,
  deepMerge: () => deepMerge,
  flattenColumns: () => flattenColumns,
  generateId: () => generateId,
  getColumnId: () => getColumnId,
  isArray: () => isArray,
  isNil: () => isNil,
  isObject: () => isObject,
  mapColumnDefs: () => mapColumnDefs,
  throttle: () => throttle
});
module.exports = __toCommonJS(index_exports);

// src/core/gridCore.ts
var import_table_core = require("@tanstack/table-core");

// src/core/columnMapper.ts
function mapColumnDefs(soColumns, defaultColDef) {
  return soColumns.map((soCol) => mapSingleColumn(soCol, defaultColDef));
}
function mapSingleColumn(soCol, defaultColDef) {
  const mergedCol = { ...defaultColDef, ...soCol };
  const colId = mergedCol.colId || String(mergedCol.field) || "";
  if (mergedCol.children && mergedCol.children.length > 0) {
    return {
      id: colId,
      header: mergedCol.checkboxSelection ? mergedCol.headerName ?? "" : mergedCol.headerName || colId,
      columns: mapColumnDefs(mergedCol.children, defaultColDef)
    };
  }
  if (mergedCol.valueGetter) {
    return {
      id: colId,
      header: mergedCol.checkboxSelection ? mergedCol.headerName ?? "" : mergedCol.headerName || String(mergedCol.field || "") || colId,
      accessorFn: (row) => {
        return mergedCol.valueGetter({
          data: row,
          colDef: mergedCol
        });
      },
      enableSorting: mergedCol.sortable === true,
      enableColumnFilter: mergedCol.filterable !== false,
      enableResizing: mergedCol.resizable !== false,
      enableHiding: !mergedCol.lockVisible,
      size: mergedCol.width,
      minSize: mergedCol.minWidth,
      maxSize: mergedCol.maxWidth,
      meta: {
        soColDef: mergedCol,
        flex: mergedCol.flex,
        cellRenderer: mergedCol.cellRenderer,
        headerRenderer: mergedCol.headerRenderer,
        valueFormatter: mergedCol.valueFormatter,
        cellClass: mergedCol.cellClass,
        headerClass: mergedCol.headerClass,
        editable: mergedCol.editable,
        cellEditor: mergedCol.cellEditor,
        cellEditorParams: mergedCol.cellEditorParams,
        cellStyle: mergedCol.cellStyle,
        headerStyle: mergedCol.headerStyle,
        checkboxSelection: mergedCol.checkboxSelection
      }
    };
  }
  if (mergedCol.field) {
    return {
      id: colId,
      header: mergedCol.checkboxSelection ? mergedCol.headerName ?? "" : mergedCol.headerName || String(mergedCol.field || "") || colId,
      accessorKey: mergedCol.field,
      enableSorting: mergedCol.sortable === true,
      enableColumnFilter: mergedCol.filterable !== false,
      enableResizing: mergedCol.resizable !== false,
      enableHiding: !mergedCol.lockVisible,
      size: mergedCol.width,
      minSize: mergedCol.minWidth,
      maxSize: mergedCol.maxWidth,
      meta: {
        soColDef: mergedCol,
        flex: mergedCol.flex,
        cellRenderer: mergedCol.cellRenderer,
        headerRenderer: mergedCol.headerRenderer,
        valueFormatter: mergedCol.valueFormatter,
        cellClass: mergedCol.cellClass,
        headerClass: mergedCol.headerClass,
        editable: mergedCol.editable,
        cellEditor: mergedCol.cellEditor,
        cellEditorParams: mergedCol.cellEditorParams,
        cellStyle: mergedCol.cellStyle,
        headerStyle: mergedCol.headerStyle,
        checkboxSelection: mergedCol.checkboxSelection
      }
    };
  }
  return {
    id: colId,
    header: mergedCol.headerName ?? String(mergedCol.field) ?? colId,
    enableSorting: mergedCol.sortable === true,
    enableColumnFilter: mergedCol.filterable !== false,
    enableResizing: mergedCol.resizable !== false,
    enableHiding: !mergedCol.lockVisible,
    size: mergedCol.width,
    minSize: mergedCol.minWidth,
    maxSize: mergedCol.maxWidth,
    meta: {
      soColDef: mergedCol,
      flex: mergedCol.flex,
      cellRenderer: mergedCol.cellRenderer,
      headerRenderer: mergedCol.headerRenderer,
      valueFormatter: mergedCol.valueFormatter,
      cellClass: mergedCol.cellClass,
      headerClass: mergedCol.headerClass,
      editable: mergedCol.editable,
      cellEditor: mergedCol.cellEditor,
      cellEditorParams: mergedCol.cellEditorParams,
      cellStyle: mergedCol.cellStyle,
      headerStyle: mergedCol.headerStyle
    }
  };
}
function getColumnId(colDef) {
  return colDef.colId || String(colDef.field) || "";
}
function flattenColumns(columns) {
  const result = [];
  function flatten(cols) {
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        flatten(col.children);
      } else {
        result.push(col);
      }
    }
  }
  flatten(columns);
  return result;
}

// src/core/gridCore.ts
var SOGridCore = class {
  constructor(options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.options = options;
    this.state = this.initializeState();
    this.table = this.createTableInstance();
  }
  initializeState() {
    const { defaultSortModel, paginationPageSize, columnPinning } = this.options;
    return {
      sorting: defaultSortModel ? defaultSortModel.map((s) => ({ id: s.colId, desc: s.sort === "desc" })) : [],
      rowSelection: {},
      pagination: {
        pageIndex: 0,
        pageSize: paginationPageSize || 10
      },
      columnPinning: columnPinning || { left: [], right: [] },
      columnVisibility: this.getInitialVisibility(),
      globalFilter: this.options.quickFilterText || ""
    };
  }
  getInitialVisibility() {
    const visibility = {};
    for (const col of this.options.columnDefs) {
      if (col.hide) {
        const colId = col.colId || String(col.field);
        visibility[colId] = false;
      }
    }
    return visibility;
  }
  createTableInstance() {
    const columns = mapColumnDefs(
      this.options.columnDefs,
      this.options.defaultColDef
    );
    return (0, import_table_core.createTable)({
      data: this.options.rowData,
      columns,
      state: {
        sorting: this.state.sorting,
        rowSelection: this.state.rowSelection,
        pagination: this.state.pagination,
        columnPinning: this.state.columnPinning,
        columnVisibility: this.state.columnVisibility,
        globalFilter: this.state.globalFilter
      },
      onStateChange: () => {
      },
      renderFallbackValue: null,
      getCoreRowModel: (0, import_table_core.getCoreRowModel)(),
      getSortedRowModel: this.options.sortable !== false ? (0, import_table_core.getSortedRowModel)() : void 0,
      getFilteredRowModel: this.options.filterable !== false ? (0, import_table_core.getFilteredRowModel)() : void 0,
      getPaginationRowModel: this.options.pagination ? (0, import_table_core.getPaginationRowModel)() : void 0,
      enableRowSelection: this.options.rowSelection !== false,
      enableMultiRowSelection: this.options.rowSelection === "multiple",
      enableSorting: this.options.sortable !== false,
      enableMultiSort: this.options.multiSort !== false,
      enableFilters: this.options.filterable !== false,
      enableColumnPinning: true,
      enableColumnResizing: true,
      manualPagination: false,
      onSortingChange: (updater) => {
        this.state.sorting = typeof updater === "function" ? updater(this.state.sorting) : updater;
        this.notifyListeners();
      },
      onRowSelectionChange: (updater) => {
        this.state.rowSelection = typeof updater === "function" ? updater(this.state.rowSelection) : updater;
        this.options.onSelectionChanged?.(this.getSelectedRows());
        this.notifyListeners();
      },
      onPaginationChange: (updater) => {
        this.state.pagination = typeof updater === "function" ? updater(this.state.pagination) : updater;
        this.notifyListeners();
      },
      onColumnPinningChange: (updater) => {
        this.state.columnPinning = typeof updater === "function" ? updater(this.state.columnPinning) : updater;
        this.notifyListeners();
      },
      onColumnVisibilityChange: (updater) => {
        this.state.columnVisibility = typeof updater === "function" ? updater(this.state.columnVisibility) : updater;
        this.notifyListeners();
      },
      onGlobalFilterChange: (updater) => {
        this.state.globalFilter = typeof updater === "function" ? updater(this.state.globalFilter) : updater;
        this.notifyListeners();
      }
    });
  }
  notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
  /**
   * 상태 변경 리스너 등록
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
   * TanStack Table 인스턴스 반환
   */
  getTable() {
    return this.table;
  }
  /**
   * 현재 상태 반환
   */
  getState() {
    return this.state;
  }
  /**
   * 옵션 반환
   */
  getOptions() {
    return this.options;
  }
  /**
   * 선택된 행 반환
   */
  getSelectedRows() {
    return this.table.getSelectedRowModel().rows.map((row) => row.original);
  }
  /**
   * API 객체 생성
   */
  createApi() {
    return {
      // 데이터
      setRowData: (rowData) => {
        this.options.rowData = rowData;
        this.table = this.createTableInstance();
        this.notifyListeners();
      },
      getRowData: () => this.options.rowData,
      getDisplayedRowCount: () => this.table.getRowModel().rows.length,
      // 선택
      getSelectedRows: () => this.getSelectedRows(),
      selectAll: () => this.table.toggleAllRowsSelected(true),
      deselectAll: () => this.table.toggleAllRowsSelected(false),
      selectRow: (rowIndex) => {
        const row = this.table.getRowModel().rows[rowIndex];
        row?.toggleSelected(true);
      },
      deselectRow: (rowIndex) => {
        const row = this.table.getRowModel().rows[rowIndex];
        row?.toggleSelected(false);
      },
      // 정렬
      setSortModel: (sortModel) => {
        this.state.sorting = sortModel.map((s) => ({
          id: s.colId,
          desc: s.sort === "desc"
        }));
        this.notifyListeners();
      },
      getSortModel: () => this.state.sorting.map((s) => ({
        colId: s.id,
        sort: s.desc ? "desc" : "asc"
      })),
      // 필터
      setQuickFilter: (filterText) => {
        this.state.globalFilter = filterText;
        this.table.setGlobalFilter(filterText);
        this.notifyListeners();
      },
      resetFilters: () => {
        this.state.globalFilter = "";
        this.table.resetGlobalFilter();
        this.table.resetColumnFilters();
        this.notifyListeners();
      },
      // 페이지네이션
      setPage: (page) => {
        this.state.pagination.pageIndex = page;
        this.table.setPageIndex(page);
        this.notifyListeners();
      },
      getPage: () => this.state.pagination.pageIndex,
      getTotalPages: () => this.table.getPageCount(),
      setPageSize: (size) => {
        this.state.pagination.pageSize = size;
        this.table.setPageSize(size);
        this.notifyListeners();
      },
      // 컬럼
      setColumnVisible: (colId, visible) => {
        this.state.columnVisibility[colId] = visible;
        this.table.setColumnVisibility(this.state.columnVisibility);
        this.notifyListeners();
      },
      setColumnPinned: (colId, pinned) => {
        const left = this.state.columnPinning.left?.filter((id) => id !== colId) || [];
        const right = this.state.columnPinning.right?.filter((id) => id !== colId) || [];
        if (pinned === "left") {
          left.push(colId);
        } else if (pinned === "right") {
          right.push(colId);
        }
        this.state.columnPinning = { left, right };
        this.table.setColumnPinning(this.state.columnPinning);
        this.notifyListeners();
      },
      getColumnState: () => {
        return this.table.getAllColumns().map((col) => ({
          colId: col.id,
          width: col.getSize(),
          hide: !col.getIsVisible(),
          pinned: col.getIsPinned() || false,
          sort: col.getIsSorted() || null,
          sortIndex: col.getSortIndex()
        }));
      },
      setColumnState: (state) => {
        const visibility = {};
        const pinning = { left: [], right: [] };
        const sorting = [];
        for (const col of state) {
          if (col.hide !== void 0) {
            visibility[col.colId] = !col.hide;
          }
          if (col.pinned === "left") {
            pinning.left.push(col.colId);
          } else if (col.pinned === "right") {
            pinning.right.push(col.colId);
          }
          if (col.sort) {
            sorting.push({ id: col.colId, desc: col.sort === "desc" });
          }
        }
        this.state.columnVisibility = visibility;
        this.state.columnPinning = pinning;
        this.state.sorting = sorting;
        this.notifyListeners();
      },
      // 유틸
      refreshCells: () => {
        this.notifyListeners();
      },
      sizeColumnsToFit: () => {
        this.notifyListeners();
      },
      exportDataAsCsv: (params) => {
        const rows = params?.onlySelected ? this.getSelectedRows() : this.options.rowData;
        const columns = this.options.columnDefs.filter((col) => {
          if (params?.columnKeys) {
            const colId = col.colId || String(col.field);
            return params.columnKeys.includes(colId);
          }
          return !col.hide;
        });
        const headers = columns.map((col) => col.headerName || String(col.field)).join(",");
        const csvRows = rows.map(
          (row) => columns.map((col) => {
            const field = col.field;
            const value = field ? row[field] : "";
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(",")
        );
        const csv = [headers, ...csvRows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = params?.fileName || "export.csv";
        link.click();
      }
    };
  }
};
function createSOGrid(options) {
  return new SOGridCore(options);
}

// src/utils/index.ts
function isNil(value) {
  return value === null || value === void 0;
}
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (!source) return target;
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (isObject(sourceValue) && isObject(targetValue)) {
        target[key] = deepMerge({ ...targetValue }, sourceValue);
      } else if (sourceValue !== void 0) {
        target[key] = sourceValue;
      }
    }
  }
  return deepMerge(target, ...sources);
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isArray(value) {
  return Array.isArray(value);
}
function generateId(prefix = "so-grid") {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
function debounce(fn, delay) {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
function classNames(...classes) {
  return classes.flatMap((cls) => {
    if (!cls) return [];
    if (typeof cls === "string") return [cls];
    return Object.entries(cls).filter(([, value]) => value).map(([key]) => key);
  }).join(" ");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SOGridCore,
  classNames,
  createSOGrid,
  debounce,
  deepMerge,
  flattenColumns,
  generateId,
  getColumnId,
  isArray,
  isNil,
  isObject,
  mapColumnDefs,
  throttle
});

import { AgGridReact } from "ag-grid-react";
import PropTypes from 'prop-types';
import React from "react";
import { useSelector } from "react-redux";
import { selectPaginatedRowData, selectRowData } from "../../slice/AgGridTableSlice";

function AgGridTable(props: any): JSX.Element {
  const selectPaginatedRowDataMemo = React.useMemo(() => selectPaginatedRowData(props.tableId, props.currentPage), [props.tableId, props.currentPage]);
  const paginatedRowData = useSelector(selectPaginatedRowDataMemo);

  const selectRowDataMemo = React.useMemo(() => selectRowData(props.tableId), [props.tableId]);
  const rowData = useSelector(selectRowDataMemo);

  const tableRows = props.serverSidePagination ? paginatedRowData : rowData;

  // const selectSelectedRowDataMemo = React.useMemo(() => selectSelectedRowData(props.tableId), [props.tableId]);
  // const selectedRows: any = useSelector(selectSelectedRowDataMemo) || [];

  return (
    <AgGridReact
      defaultColDef={props.defaultColDef}
      ref={props.gridRef}
      columnDefs={props.columnDefs}
      suppressCopyRowsToClipboard={props.suppressCopyRowsToClipboard}
      onGridReady={props.onGridReady}
      onRowClicked={props.onRowClicked}
      onRowSelected={props.onRowSelected}
      cacheBlockSize={1000}
      rowSelection={props.rowSelection}
      onSelectionChanged={props.onSelectionChanged}
      rowData={tableRows}
      frameworkComponents={props.frameworkComponents}
      pagination={props.pagination}
      paginationPageSize={props.paginationPageSize}
      paginationNumberFormatter={props.paginationNumberFormatter}
      onFirstDataRendered={props.onFirstDataRendered}
      overlayLoadingTemplate={
        '<span className="ag-overlay-loading-center">...</span>'
      }
      overlayNoRowsTemplate={
        '<span className="ag-overlay-loading-center"></span>'
      }
    />

  );
}

AgGridTable.propTypes = {
  currentPage: PropTypes.number,
  gridApi: PropTypes.any,
  tableId: PropTypes.string.isRequired,
  defaultColDef: PropTypes.object.isRequired,
  gridRef: PropTypes.object,
  columnDefs: PropTypes.array.isRequired,
  onSelectionChanged: PropTypes.func,
  onGridReady: PropTypes.func,
  onRowClicked: PropTypes.func,
  onRowSelected: PropTypes.func,
  rowData: PropTypes.any,
  suppressCopyRowsToClipboard: PropTypes.bool,
  rowSelection: PropTypes.any,
  pagination: PropTypes.any,
  suppressRowClickSelection: PropTypes.bool,
  paginationPageSize: PropTypes.number,
  paginationNumberFormatter: PropTypes.func,
  onFirstDataRendered: PropTypes.func,
  frameworkComponents: PropTypes.any,
  serverSidePagination: PropTypes.bool.isRequired
}
export default AgGridTable;